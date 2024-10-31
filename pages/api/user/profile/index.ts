// pages/api/users/profile.ts
import { withAuth } from "@/src/auth/middleware";
import getProfileInteractor from "@/src/user/profile/get-profile";
// import updateProfileInteractor from "@/src/user/profile/update-profile";
import type { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getProfileInteractor(req, res);
  } else if (req.method === "PUT") {
    // return updateProfileInteractor(req, res);
  } else {
    res.setHeader("Allow", ["GET", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default withAuth(handler);
