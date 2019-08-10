/**
 * turns
 *   { 'MUCH ERROR': '0', 'SUCH WRONG': '1' }
 * into
 *   { 0: 'MUCH ERROR', 1: 'SUCH WRONG' }
 */

type Dict = { [key: string]: any };

export function invertObject(
  targetObj: Dict /* : ErrorMap */
) /* : ErrorMap */ {
  const result: Dict = {};
  const mapKeys = Object.keys(targetObj);

  for (const originalKey of mapKeys) {
    const originalVal = targetObj[originalKey];

    result[originalVal] = originalKey;
  }

  return result;
}
