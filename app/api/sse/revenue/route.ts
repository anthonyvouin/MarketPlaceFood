import { PrismaClient, StatusOrder } from '@prisma/client';

const prisma = new PrismaClient();
const UPDATE_INTERVAL = 6000;

export const dynamic = 'force-dynamic';

export async function GET() {
    const response: Response = new Response(
        new ReadableStream({
            async start(controller) {
                let isActive = true;

                const sendData: () => Promise<void> = async () => {
                    while (isActive) {
                        try {
                            const revenue = await prisma.order.aggregate({
                                where: { status: StatusOrder.PAYMENT_SUCCEDED },
                                _sum: {
                                    totalAmount: true,
                                },
                            });

                            const data = {
                                timestamp: new Date().toISOString(),
                                amount: (revenue._sum.totalAmount ?? 0) / 100
                            };

                            if (isActive) {
                                controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`));
                                await new Promise(resolve => setTimeout(resolve, UPDATE_INTERVAL));
                            }
                        } catch (error) {
                            console.error('Erreur SSE:', error);
                            isActive = false;
                            controller.close();
                            break;
                        }
                    }
                };

                sendData();

                return () => {
                    isActive = false;
                    controller.close();
                };
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