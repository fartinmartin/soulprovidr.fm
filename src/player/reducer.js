import { handleActions } from 'redux-actions';

import Actions from './actions';

const initialState = {
  isBuffering: false,
  isPlaying: false
};
export default handleActions({
  [Actions.play]: state => ({ ...state, isBuffering: true }),
  [Actions.playFailure]: state => ({ ...state, isBuffering: false, isPlaying: false }),
  [Actions.playSuccess]: state => ({ ...state, isBuffering: false, isPlaying: true }),
  [Actions.pause]: state => ({ ...state, isPlaying: false })
}, initialState);