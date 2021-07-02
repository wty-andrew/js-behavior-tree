import React, { useState, useEffect } from 'react'
import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Icon,
  IconButton,
  Button,
  Stack,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Spacer,
} from '@chakra-ui/react'
import { VscPlug, VscDebugDisconnect } from 'react-icons/vsc'

import { treeRepr, TreeInfo, BehaviorTree } from '../src'
import { ros } from './ros'
import { MoveBaseFlexBTDemo } from './trees'
import TreeView from './components/TreeView'
import useTimer from './hooks/useTimer'

const tree = new BehaviorTree(MoveBaseFlexBTDemo())
tree.setup()

console.log(treeRepr(tree.info))

const App: React.FC = () => {
  const [url, setUrl] = useState('0.0.0.0:9090')
  const [info, setInfo] = useState<TreeInfo>(tree.info)
  const [isConnected, setIsConnected] = useState(false)
  const [tickFreq, setTickFreq] = useState(1)

  useEffect(() => {
    ros.on('connection', () => {
      setIsConnected(true)
      console.log('ROS connection established')
    })
    ros.on('close', () => {
      setIsConnected(false)
      console.log('ROS connection closed')
    })
    ros.on('error', (error) => console.error(error))
  }, [])

  const tick = () => {
    tree.tick()
    setInfo(tree.info)
  }

  const toggleConnection = () => {
    if (isConnected) ros.close()
    else ros.connect(`ws://${url}`)
  }

  const { start, stop } = useTimer(tick, 1000 / tickFreq)

  return (
    <Box maxWidth="600px" margin="0 auto" padding="50px">
      <Stack spacing="10" direction="column">
        <InputGroup size="lg">
          <InputLeftAddon>ws://</InputLeftAddon>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="connect"
              icon={<Icon as={isConnected ? VscDebugDisconnect : VscPlug} />}
              isRound
              cursor="pointer"
              colorScheme={isConnected ? 'red' : 'green'}
              onClick={toggleConnection}
            />
          </InputRightElement>
        </InputGroup>

        <HStack spacing="5">
          <FormControl width="200px">
            <FormLabel>Tick Frequency {tickFreq}</FormLabel>

            <Slider
              defaultValue={1}
              min={1}
              max={5}
              step={1}
              onChange={setTickFreq}
            >
              <SliderTrack>
                <Box position="relative" right={10} />
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={5} />
            </Slider>
          </FormControl>

          <Spacer />

          <Button colorScheme="green" onClick={start}>
            Start
          </Button>
          <Button colorScheme="red" onClick={stop}>
            Stop
          </Button>
          <Button colorScheme="blue" onClick={() => tick()}>
            Tick
          </Button>
        </HStack>

        <Box>{tree && <TreeView data={info} />}</Box>
      </Stack>
    </Box>
  )
}

export default App
