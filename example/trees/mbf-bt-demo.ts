import { Node, Selector, Sequence } from '../../src'
import {
  CheckBlackboardVariable,
  ClearBlackboardVariable,
  ToBlackboard,
  RosActionNode,
} from '../nodes'
import { Blackboard } from '../store/blackboard'
import { GetPathGoal, GetPathResult, ExePathGoal, ExePathResult } from '../ros'

// Port example from http://wiki.ros.org/move_base_flex/Tutorials/BehaviourTreesForMoveBaseFlex
export const MoveBaseFlexBTDemo = (): Node => {
  const root = new Sequence('Demo')
  const GetGoal = new Selector('GetGoal')
  const Fallback = new Selector('Fallback')
  const Navigate = new Sequence('Navigate')

  const NewGoal = new ToBlackboard(
    'NewGoal',
    '/move_base_simple/goal',
    'geometry_msgs/PoseStamped',
    'target_pose'
  )
  const GetPath = new RosActionNode<Partial<GetPathGoal>, GetPathResult>(
    'GetPath',
    '/move_base_flex/get_path',
    'mbf_msgs/GetPathAction',
    () => {
      const target_pose = Blackboard['target_pose']
      return target_pose ? { target_pose } : null
    },
    (result) => {
      const success = result.outcome === 0
      if (success) Blackboard['path'] = result.path
      return success
    }
  )

  const ExePath = new RosActionNode<Partial<ExePathGoal>, ExePathResult>(
    'ExePath',
    '/move_base_flex/exe_path',
    'mbf_msgs/ExePathAction',
    () => {
      const path = Blackboard['path']
      return path ? { path } : null
    },
    (result) => result.outcome === 0
  )

  const HaveGoal = new CheckBlackboardVariable('HaveGoal', 'target_pose')
  const ClearGoal1 = new ClearBlackboardVariable('ClearGoal', 'target_pose')
  const ClearGoal2 = new ClearBlackboardVariable('ClearGoal', 'target_pose')

  GetGoal.addChildren(HaveGoal, NewGoal)
  Navigate.addChildren(GetPath, ExePath, ClearGoal1)
  Fallback.addChildren(Navigate, ClearGoal2)
  root.addChildren(GetGoal, Fallback)
  return root
}
