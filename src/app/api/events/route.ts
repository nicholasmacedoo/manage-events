import { prisma } from "@lib/prisma"
import { NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";


export async function GET(request: NextRequest) {
  const events = await prisma.events.findMany();

  return NextResponse.json(events)
}

const eventBodySchema = z.object({
  name: z.string(),
  date: z.string().transform(value => new Date(value))
});

export async function POST(request: Request, response: NextApiResponse) {

  const body = await request.json();
  const { date, name } = eventBodySchema.parse(body);

  const checkExistEventSomeDate = await prisma.events.findFirst({
    where: {
      date,
    }
  })

  if (checkExistEventSomeDate) return new Response('Já existe evento nessa data', {
    status: 400,
  })

  const event = await prisma.events.create({
    data: {
      name,
      date,
      active: true,
    }
  })

  return NextResponse.json(event)
}