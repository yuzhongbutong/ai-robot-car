export default {
  INDEX_TAB_0: 0,
  INDEX_TAB_1: 1,
  INDEX_TAB_2: 2,

  CAR_COMMAND: {
    F: {
      value: 'FORWARD',
      keywords: ['FORWARD', 'GO', 'RUN', '前']
    },
    R: {
      value: 'RIGHTWARD',
      keywords: ['RIGHTWARD', 'RIGHT', '右']
    },
    B: {
      value: 'BACKWARD',
      keywords: ['BACKWARD', 'BACK', '后']
    },
    L: {
      value: 'LEFTWARD',
      keywords: ['LEFTWARD', 'LEFT', '左']
    },
    S: {
      value: 'STOP',
      keywords: ['STOP', 'PAUSE', '停']
    }
  },

  MSG_FROM_ROBOT: 'robot',
  MSG_FROM_CUSTOM: 'custom',
  MSG_TIME_FORMAT: 'hh:mm:ss',
};