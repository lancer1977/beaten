export class StringExtensions{
  public static replaceSpaces(input: string): string  {
    return input.split(' ').join('_');
  };
  public static replace(input: string, find: string , replaceWith: string ): string  {
    return input.split(find).join(replaceWith);
  };
  public static getRandomItem<T>(arr: T[]): T {
    const [randomItem] = arr.sort(() => 0.5 - Math.random());
    return randomItem;
}
 
}

export class Helpers{
  public static delay(ms: number) 
  {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}