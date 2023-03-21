import { Response } from "@/types/index";
import { AxiosResponse } from "axios";

export const SUCCESS = (code: number) => {
  if (code === 200) {
    return true;
  } else {
    return false;
  }
};
