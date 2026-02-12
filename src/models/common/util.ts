import { Timestamp, FieldValue } from "firebase-admin/firestore";

export const main = async <Args extends unknown[], Return>(
  func: (...args: Args) => Promise<Return>,
  ...args: Args
) => {
  const getCallerFile = () => {
    const originalFunc = Error.prepareStackTrace;
    let callerFile = null;
    try {
      const err = new Error();
      Error.prepareStackTrace = function (err, stack) {
        return stack;
      };
      const stack = err.stack as unknown;
      Error.prepareStackTrace = originalFunc;
      if (stack && Array.isArray(stack) && stack.length >= 3) {
        callerFile = stack[2].getFileName();
      }
    } catch (e: unknown) {
      console.error("getCallerFile error: ", e);
    }
    return callerFile;
  };

  if (
    getCallerFile() === require.main?.filename &&
    process.env.RUN_SCRIPT === "true"
  ) {
    console.log("main executed function name: ", getCallerFile());
    func(...args)
      .then((result) => {
        console.log("result: ", result);
        process.exit(0);
      })
      .catch((error) => {
        console.error("error: ", error);
        process.exit(1);
      });
  }
};


export const getUpdateParam = <T extends Record<string, unknown>>(param: T) => {
  const updateData = Object.entries(param).reduce(
    (acc, [key, value]) =>
      value !== undefined
        ? {
          ...acc,
          [key as keyof T]:
            value instanceof Date ? Timestamp.fromDate(value) : value,
        }
        : acc,
    {},
  );
  // 少なくとも1つの更新フィールドが必要
  if (Object.keys(updateData).length === 0) {
    throw new Error("Invalid update data: no fields to update");
  }
  return { ...updateData, updated_at: FieldValue.serverTimestamp() };
};