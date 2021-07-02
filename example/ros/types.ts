// std_msgs
export type Stamp = {
  nsecs: number
  secs: number
}

export type Header = {
  seq: number
  time: Stamp
  frame_id: string
}

// geometry_msgs
export type Point = {
  x: number
  y: number
  z: number
}

export type Quaternion = {
  x: number
  y: number
  z: number
  w: number
}

export type Pose = {
  position: Point
  orientation: Quaternion
}

export type PoseStamped = {
  header: Header
  pose: Pose
}

// nav_msgs
export type Path = {
  header: Header
  poses: PoseStamped[]
}

// mbf_msgs
export type GetPathGoal = {
  use_start_pose: boolean
  start_pose: PoseStamped
  target_pose: PoseStamped
  tolerance: number
  planner: string
  concurrency_slot: number
}

export type GetPathResult = {
  outcome: number
  message: string
  path: Path
  cost: number
}

export type ExePathGoal = {
  path: Path[]
  controller: string
  concurrency_slot: number
  tolerance_from_action: boolean
  dist_tolerance: number
  angle_tolerance: number
}

export type ExePathResult = {
  outcome: number
  message: string
  final_pose: PoseStamped
  dist_to_goal: number
  angle_to_goal: number
}
