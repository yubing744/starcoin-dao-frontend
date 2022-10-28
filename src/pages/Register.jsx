import React, { useEffect, useState } from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { useHistory, useParams, Link as RouterLink } from 'react-router-dom';
import { Flex, Icon, Box, Button } from '@chakra-ui/react';

import { useInjectedProvider } from '../contexts/InjectedProviderContext';
import { useUser } from '../contexts/UserContext';
import DaoMetaForm from '../forms/daoMetaForm';
import Layout from '../components/layout';
import MainViewLayout from '../components/mainViewLayout';
import { supportedChains } from '../utils/chain';
import { Step, Steps, useSteps } from 'chakra-ui-steps';

const Register = () => {
  const { registerchain, daoid } = useParams();
  const { refetchUserHubDaos } = useUser();
  const history = useHistory();
  const { address, injectedChain, requestWallet } = useInjectedProvider();
  const [currentDao, setCurrentDao] = useState();
  const [needsNetworkChange, setNeedsNetworkChange] = useState();

  useEffect(() => {
    if (address && injectedChain) {
      setCurrentDao({
        address: daoid,
        name: '',
        description: '',
        longDescription: '',
        purpose: '',
        summonerAddress: address,
        version: '2.1',
      });

      setNeedsNetworkChange(injectedChain.chain_id !== registerchain);
    }
  }, [address, injectedChain]);

  const handleUpdate = async ret => {
    refetchUserHubDaos();
    sessionStorage.removeItem('exploreDaoData');

    history.push(`/dao/${ret.chainId}/${ret.daoAddress}`);
  };

  const content = (
    <Flex>
      <p>asd</p>
    </Flex>
  );

  const steps = [
    { label: 'Step 1', content },
    { label: 'Step 2', content },
    { label: 'Step 3', content },
  ];

  const { nextStep, prevStep, setStep, reset, activeStep } = useSteps({
    initialStep: 0,
  });

  return (
    <Layout>
      <MainViewLayout header='Register'>
        {injectedChain && !needsNetworkChange ? (
          <>
            {currentDao ? (
              <>
                <Flex ml={6} justify='space-between' align='center' w='100%'>
                  <Flex as={RouterLink} to='/' align='center'>
                    <Icon as={BiArrowBack} color='secondary.500' mr={2} />
                    Back
                  </Flex>
                </Flex>
                <Box w='40%'>
                  <DaoMetaForm
                    handleUpdate={handleUpdate}
                    metadata={currentDao}
                  />
                </Box>
                {/* <Box w='40%'>
                  <Flex flexDir='column' w='100%'>
                    <Steps activeStep={activeStep} width='100%'>
                      {steps.map(({ label, content }) => (
                        <Step label={label} key={label}>
                          {content}
                        </Step>
                      ))}
                    </Steps>
                    {activeStep === steps.length ? (
                      <Flex p={4}>
                        <Button mx='auto' size='sm' onClick={reset}>
                          Reset
                        </Button>
                      </Flex>
                    ) : (
                      <Flex width='100%' justify='flex-end'>
                        <Button
                          isDisabled={activeStep === 0}
                          mr={4}
                          onClick={prevStep}
                          size='sm'
                          variant='ghost'
                        >
                          Prev
                        </Button>
                        <Button size='sm' onClick={nextStep}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                </Box> */}
              </>
            ) : (
              <Box
                fontSize={['lg', null, null, '3xl']}
                fontFamily='heading'
                fontWeight={700}
                ml={10}
              >
                loading...
              </Box>
            )}
          </>
        ) : (
          <Box
            rounded='lg'
            bg='blackAlpha.600'
            borderWidth='1px'
            borderColor='whiteAlpha.200'
            p={6}
            m={[10, 'auto', 0, 'auto']}
            w='50%'
            textAlign='center'
          >
            <Box
              fontSize={['lg', null, null, '3xl']}
              fontFamily='heading'
              fontWeight={700}
              ml={10}
            >
              {`You need to switch your network to to register this dao.`}
            </Box>
          </Box>
        )}
      </MainViewLayout>
    </Layout>
  );
};

export default Register;
