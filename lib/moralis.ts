import Moralis from "moralis";

class MoralisInstance {
  private static instance: typeof Moralis;
  private static isInitializing: boolean = false;

  private constructor() {}

  public static async getInstance(): Promise<typeof Moralis> {
    if (this.instance) {
      return this.instance;
    }

    if (this.isInitializing) {
      // Wait for initialization to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getInstance();
    }

    try {
      this.isInitializing = true;
      if (!process.env.MORALIS_API_KEY) {
        throw new Error("MORALIS_API_KEY is not defined");
      }

      await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY,
      });
      this.instance = Moralis;
      return this.instance;
    } finally {
      this.isInitializing = false;
    }
  }
}

export default MoralisInstance; 