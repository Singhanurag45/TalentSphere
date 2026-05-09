import { randomUUID } from "node:crypto";

export function requestIdMiddleware(req, _res, next) {
  req.id = randomUUID();
  next();
}
