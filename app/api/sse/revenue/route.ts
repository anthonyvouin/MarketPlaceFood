import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UPDATE_INTERVAL = 60000; 

export async function GET() {
    const headersList = headers();
    
    const response = new Response(
        new ReadableStream({
            async start(controller) {
                let isActive = true;

                const sendData = async () => {
                    while (isActive) {
                        try {
                            const revenue = await prisma.order.aggregate({
                                _sum: {
                                    totalAmount: true,
                                },
                            });
                            
                            const data = {
                                timestamp: new Date().toISOString(),
                                amount: (revenue._sum.totalAmount ?? 0) / 100
                            };

                            if (isActive) {
                                controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
                                await new Promise(resolve => setTimeout(resolve, UPDATE_INTERVAL));
                            }
                        } catch (error) {
                            console.error('Erreur SSE:', error);
                        }
                    }
                }
            }
        }),
        {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        }
    );

    return response;
} 