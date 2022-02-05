import React, { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {Link} from 'react-router-dom'
import {AuthContext} from "../Context/AuthContext"
import Loader from "react-loader-spinner"
import { Flex, Container, ChakraProvider } from '@chakra-ui/react';
import {
    VStack,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
  } from '@chakra-ui/react';
import DatabaseService from '../Services/DatabaseService';

function AccountView(props) {
  console.log(React.useContext(AuthContext))
  const {userAddress, loading} = React.useContext(AuthContext)
  console.log(userAddress)
  console.log(loading)

  const [dealsWhereStartup, setDealsWhereStartup] = useState([])
  const [dealsWhereInvestor, setDealsWhereInvestor] = useState([])
  const [pendingDealsWhereStartup, setPendingDealsWhereStartup] = useState([])
  const [pendingDealsWhereInvestor, setPendingDealsWhereInvestor] = useState([])
  const [username, setUsername] = useState("")


  // https://stackoverflow.com/questions/10970078/modifying-a-query-string-without-reloading-the-page
  // Use this to update the url

  async function fetchDeals() {
    console.log(userAddress)
    console.log(loading)
    try {
      let user = await DatabaseService.getUser(userAddress)
      let deals = await user.getDealsWhereStartup()

      let startupPendingDeals = await user.getPendingDealsWhereStartup()
      let investorPendingDeals = await user.getPendingDealsWhereInvestor()
      let investments = await user.getDealsWhereInvestor()
      let name = user.name

      setDealsWhereStartup(deals)
      setPendingDealsWhereInvestor(investorPendingDeals)
      setPendingDealsWhereStartup(startupPendingDeals)
      setDealsWhereInvestor(investments)
      setUsername(name)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(fetchDeals, [])

  return(
    <Container maxW="container.xl" p={0}>
      <Flex
          h={{ base: 'auto', md: '100vh' }}
          py={[0, 10, 20]}
          direction={{ base: 'column-reverse', md: 'row' }}
          >
        <VStack w="full" h="full" p={10} spacing={10} alignItems="flex-start">
          <VStack spacing={3} alignItems="flex-start">
            <Heading size="2xl">My Account</Heading>
            <Text>{username}</Text>
            <Text>{userAddress}</Text>
          </VStack>

          <VStack spacing={3} alignItems="flex-start">
            <Heading size="xl">My Deals</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Deal Name</Th>
                  <Th>Deal Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dealsWhereStartup.map(function(deal, index){
                  const path = "/dealDetails?address=" + deal.dealAddress
                  return(
                    <Tr>
                      <Td>{deal.name}</Td>
                      <Td><Link to={path}>{deal.dealAddress}</Link></Td>
                    </Tr>
                  ) 
                })}
                {pendingDealsWhereStartup.map(function(pendingDeal, index){
                  return(
                    <Tr>
                      <Td>{pendingDeal.name}</Td>
                      <Td>Pending <Loader /></Td>
                    </Tr>
                  ) 
                })}
              </Tbody>
            </Table>
          </VStack>

          <VStack spacing={3} alignItems="flex-start">
            <Heading size="xl">My Investments</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Deal Name</Th>
                  <Th>Deal Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dealsWhereInvestor.map(function(deal, index){
                  const path = "/dealDetails?address=" + deal.dealAddress
                  return(
                    <Tr>
                      <Td>{deal.name}</Td>
                      <Td><Link to={path}>{deal.dealAddress}</Link></Td>
                    </Tr>
                  ) 
                })}
                {pendingDealsWhereInvestor.map(function(pendingDeal, index){
                  return(
                    <Tr>
                      <Td>{pendingDeal.name}</Td>
                      <Td>Pending <Loader /></Td>
                    </Tr>
                  ) 
                })}
              </Tbody>
            </Table>
          </VStack>
        </VStack>
      </Flex>
    </Container>

  )
}

export default AccountView;
