import { createAdjacentPairs, chunk } from "@/util/array";

describe("createAdjacentPairs", () => {
  describe("基本的な動作", () => {
    it("空の配列の場合は空の配列を返す", () => {
      const result = createAdjacentPairs([]);
      expect(result).toEqual([]);
    });

    it("1要素の配列の場合は空の配列を返す", () => {
      const result = createAdjacentPairs([1]);
      expect(result).toEqual([]);
    });

    it("2要素の配列の場合は1つのペアを返す", () => {
      const result = createAdjacentPairs([1, 2]);
      expect(result).toEqual([[1, 2]]);
    });

    it("3要素の配列の場合は2つのペアを返す", () => {
      const result = createAdjacentPairs([1, 2, 3]);
      expect(result).toEqual([
        [1, 2],
        [2, 3],
      ]);
    });

    it("5要素の配列の場合は4つのペアを返す", () => {
      const result = createAdjacentPairs([1, 2, 3, 4, 5]);
      expect(result).toEqual([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5],
      ]);
    });
  });

  describe("異なる型の配列", () => {
    it("文字列の配列で動作する", () => {
      const result = createAdjacentPairs(["a", "b", "c"]);
      expect(result).toEqual([
        ["a", "b"],
        ["b", "c"],
      ]);
    });

    it("オブジェクトの配列で動作する", () => {
      const obj1 = { id: 1, name: "first" };
      const obj2 = { id: 2, name: "second" };
      const obj3 = { id: 3, name: "third" };
      const result = createAdjacentPairs([obj1, obj2, obj3]);
      expect(result).toEqual([
        [obj1, obj2],
        [obj2, obj3],
      ]);
    });

    it("日付の配列で動作する", () => {
      const date1 = new Date("2025-01-01");
      const date2 = new Date("2025-01-02");
      const date3 = new Date("2025-01-03");
      const result = createAdjacentPairs([date1, date2, date3]);
      expect(result).toEqual([
        [date1, date2],
        [date2, date3],
      ]);
    });
  });

  describe("エッジケース", () => {
    it("nullやundefinedを含む配列でも動作する", () => {
      const result = createAdjacentPairs([null, undefined, "value"]);
      expect(result).toEqual([
        [null, undefined],
        [undefined, "value"],
      ]);
    });

    it("混在した型の配列でも動作する", () => {
      const result = createAdjacentPairs([1, "two", true, null]);
      expect(result).toEqual([
        [1, "two"],
        ["two", true],
        [true, null],
      ]);
    });
  });

  describe("実際の使用例", () => {
    it("瞑想履歴の日付ペアを作成できる", () => {
      const histories = [
        { id: "1", date: new Date("2025-01-01") },
        { id: "2", date: new Date("2025-01-02") },
        { id: "3", date: new Date("2025-01-03") },
      ];
      const pairs = createAdjacentPairs(histories);

      expect(pairs).toHaveLength(2);
      expect(pairs[0]).toEqual([histories[0], histories[1]]);
      expect(pairs[1]).toEqual([histories[1], histories[2]]);
    });
  });
});

describe("chunk", () => {
  it("should split an array into chunks of a specified size", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const chunkSize = 3;
    const expected = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];
    expect(chunk(array, chunkSize)).toEqual(expected);
  });

  it("should handle an array that divides evenly by the chunk size", () => {
    const array = [1, 2, 3, 4, 5, 6];
    const chunkSize = 2;
    const expected = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(chunk(array, chunkSize)).toEqual(expected);
  });

  it("should handle a chunk size larger than the array length", () => {
    const array = [1, 2, 3];
    expect(chunk(array, 5)).toEqual([[1, 2, 3]]);
  });

  it("should return an empty array for an empty input array", () => {
    expect(chunk([], 3)).toEqual([]);
  });

  it("should return an empty array for a chunk size of 0 or less", () => {
    const array = [1, 2, 3];
    expect(chunk(array, 0)).toEqual([]);
    expect(chunk(array, -1)).toEqual([]);
  });
});
