class BotConfiguration {
  public static isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  private static getDevelopmentChats() {
    return process.env.CHATS_DEV
      ? String(process.env.CHATS_DEV).split(',')
      : [];
  }

  public static isDevelopmentChat(chatsId: string[]): boolean {
    const developmentChats = this.getDevelopmentChats();
    const chatsAvailableForTests = chatsId.filter((id) =>
      developmentChats.some((devId) => devId === id),
    );

    return chatsAvailableForTests.length > 0;
  }

  public static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }
}

export { BotConfiguration };
