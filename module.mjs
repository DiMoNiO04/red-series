// @ts-check
import { module } from "@prisma/composer";
import redSeriesService from "./service.mjs";

export default module("red-series", ({ provision }) => {
  provision(redSeriesService, { id: "redseries" });
});
