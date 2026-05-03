export type SchemaData = {
  schemaId: number;
  codes?: string[];
  codeRegistryChainId?: number;
  codeRegistryAddress?: `0x${string}`;
  cborData?: any;
};

export type ERC8021ValidationLevel = 'Basic' | 'Standard' | 'Strict';

export interface DataSuffixCapability {
  dataSuffix: {
    value: string;
    optional?: boolean;
  };
}
