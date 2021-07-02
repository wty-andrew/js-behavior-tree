import React from 'react'
import { Badge, Box, Flex, Icon, Text, useBoolean } from '@chakra-ui/react'
import {
  VscWatch,
  VscCheck,
  VscClose,
  VscLoading,
  VscDebugStart,
} from 'react-icons/vsc'
import { IconProps } from '@chakra-ui/icon'
import { BiDirections } from 'react-icons/bi'
import { HiOutlineStar } from 'react-icons/hi'
import { BsArrowRight, BsQuestion } from 'react-icons/bs'

import { Status, TreeInfo } from '../../src'

interface StatusIconProps extends IconProps {
  status: Status
}

const StatusIcon: React.FC<StatusIconProps> = ({ status, ...props }) => {
  switch (status) {
    case Status.IDLE:
      return <Icon as={VscWatch} {...props} />
    case Status.FAILURE:
      return <Icon as={VscClose} {...props} />
    case Status.SUCCESS:
      return <Icon as={VscCheck} {...props} />
    case Status.RUNNING:
      return <Icon as={VscLoading} {...props} />
  }
}

interface NodeIconProps extends IconProps {
  type: string
}

const NodeIcon: React.FC<NodeIconProps> = ({ type, ...props }) => {
  switch (type) {
    case 'Selector':
      return <Icon as={BsQuestion} {...props} />
    case 'Sequence':
      return <Icon as={BsArrowRight} {...props} />
    case 'Decorator':
      return <Icon as={HiOutlineStar} {...props} />
    case 'Condition':
      return <Icon as={BiDirections} {...props} />
    default:
      return <Icon as={VscDebugStart} {...props} />
  }
}

const statusColor = (status: Status): string => {
  switch (status) {
    case Status.FAILURE:
      return '#dc3545'
    case Status.SUCCESS:
      return '#28a745'
    case Status.RUNNING:
      return '#ffc107'
    case Status.IDLE:
      return '#6c757d'
  }
}

const TreeView: React.FC<{ data: TreeInfo }> = ({
  data: { name, type, active, status, tickCount, children },
}) => {
  const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean()

  const color = statusColor(status)

  return (
    <>
      <Flex
        align="center"
        my="10px"
        userSelect="none"
        opacity={active ? '100%' : '20%'}
      >
        <NodeIcon
          type={type}
          focusable
          cursor={children.length > 0 ? 'pointer' : 'default'}
          onClick={toggleCollapsed}
        />
        <Text as="span" ml="10px" borderBottom={`4px solid ${color}`}>
          {name}
        </Text>

        <Badge mx="15px">{tickCount}</Badge>

        <StatusIcon status={status} color={color} />
      </Flex>

      <Box ml="40px" display={isCollapsed ? 'none' : 'block'}>
        {children.map((el, i) => (
          <TreeView key={i} data={el} />
        ))}
      </Box>
    </>
  )
}

export default TreeView
