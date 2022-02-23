import { Router } from "express";

export default async (router: Router): Promise<void> => {
  router.get("/health-check", (_, res) => res.status(200).json({ status: 'OK' }));
};
