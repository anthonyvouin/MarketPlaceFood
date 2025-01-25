import { webhook } from '@/app/api/webhook/service';

export async function POST(req: Request) {
  return webhook(req)
}