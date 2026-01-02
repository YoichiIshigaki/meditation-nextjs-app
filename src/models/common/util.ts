export const main = async <Args extends any[], Return>(
  func: (...args: Args) => Promise<Return>,
  ...args: Args
) => {
  if (require.main === module) {
    console.log("main executed function name: ", func.name);
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
