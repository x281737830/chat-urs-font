export interface Character {
    chcaracterId: number
    name: string
    tags: string
    portraitUrl: string
    template: string
    slots: Map<string, string>
    creatorAccountId: number
    creatorName: string
    lastChatTime: number
    chatTimes: number
    createTime: number
    modifyTime: number
    templateDescription: string
}