export enum FriendStatusEnum {
  BLOCKED = 'BLOCKED', // บล็อกกันแล้ว
  REMOVED = 'REMOVED', // ลบออกจากการติดตาม
  FOLLOWING = 'FOLLOWING', // กำลังติดตาม
  FOLLOWED = 'FOLLOWED', // ถูกรับการติดตาม (คนอื่นติดตามเรา)
}

export enum FriendInteractionActionEnum {
  REQUEST = 'REQUEST', // ส่งคำขอเป็นเพื่อน
  ACCEPT = 'ACCEPT', // ยอมรับคำขอเป็นเพื่อน
  BLOCK = 'BLOCK', // บล็อกเพื่อน
  UNBLOCK = 'UNBLOCK', // ยกเลิกการบล็อกเพื่อน
  REMOVE = 'REMOVE', // ลบเพื่อน
  FOLLOW = 'FOLLOW', // ติดตาม
  UN_FOLLOW = 'UN_FOLLOW', // ยกเลิกการติดตาม
  UN_FOLLOWED = 'UN_FOLLOWED', // ถูกยกเลิกการติดตาม
}
