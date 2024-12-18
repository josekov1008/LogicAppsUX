import constants from '../../../constants';
import { isEmpty } from '../../../dictionary/expandeddictionary';
import type { ValueSegment } from '../../models/parameter';
import { createLiteralValueSegment, insertQutationForStringType } from './helper';
import { convertSegmentsToString } from './parsesegments';
import { isNumber, isBoolean, escapeString } from '@microsoft/logic-apps-shared';

export interface KeyValueItem {
  id: string;
  key: ValueSegment[];
  value: ValueSegment[];
}

export const convertKeyValueItemToSegments = (items: KeyValueItem[], keyType?: string, valueType?: string): ValueSegment[] => {
  const itemsToConvert = items.filter((item) => {
    return !isEmpty(item);
  });

  if (itemsToConvert.length === 0) {
    return [createLiteralValueSegment('')];
  }
  const parsedItems: ValueSegment[] = [];
  parsedItems.push(createLiteralValueSegment('{\n '));

  for (let index = 0; index < itemsToConvert.length; index++) {
    const { key, value } = itemsToConvert[index];
    // todo: we should have some way of handle formatting better
    const convertedKeyType = convertValueType(key, keyType);
    const updatedKey = key.map((segment) => {
      return {
        ...segment,
        value: convertedKeyType !== constants.SWAGGER.TYPE.STRING ? segment.value : escapeString(segment.value),
      };
    });

    const convertedValueType = convertValueType(value, valueType);
    const updatedValue = value.map((segment) => {
      return {
        ...segment,
        value: convertedValueType !== constants.SWAGGER.TYPE.STRING ? segment.value : escapeString(segment.value),
      };
    });

    insertQutationForStringType(parsedItems, convertedKeyType);
    parsedItems.push(...updatedKey);
    insertQutationForStringType(parsedItems, convertedKeyType);
    parsedItems.push(createLiteralValueSegment(' : '));
    insertQutationForStringType(parsedItems, convertedValueType);
    parsedItems.push(...updatedValue);
    insertQutationForStringType(parsedItems, convertedValueType);
    parsedItems.push(createLiteralValueSegment(index < itemsToConvert.length - 1 ? ',\n ' : '\n}'));
  }

  return parsedItems;
};

// we want to default to string type when the value is type any
export const convertValueType = (value: ValueSegment[], type?: string): string | undefined => {
  if (type && type !== constants.SWAGGER.TYPE.ANY) {
    return type;
  }
  const stringSegments = convertSegmentsToString(value).trim();
  const isExpressionOrObject = (stringSegments.startsWith('@{') || stringSegments.startsWith('{')) && stringSegments.endsWith('}');
  const isKnownType = isExpressionOrObject || isNumber(stringSegments) || isBoolean(stringSegments) || /^\[.*\]$/.test(stringSegments);

  return isKnownType ? type : constants.SWAGGER.TYPE.STRING;
};
