import { Attribution } from "ox/erc8021";

export const BUILDER_CODE = "bc_emd9geld";
export const DATA_SUFFIX = Attribution.toDataSuffix({ codes: [BUILDER_CODE] });
export const DATA_SUFFIX_HEX = DATA_SUFFIX.slice(2);
