// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withAuth } from "@/src/auth/middleware";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}

export default withAuth(handler, { admin: true });
