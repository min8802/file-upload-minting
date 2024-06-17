import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { FC, useEffect, useState } from "react";
import mintNftAbi from "./mintNftAbi.json";

const App : FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  const onClickMetamask = async () => {
    try {
      if(!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      setSigner(await provider.getSigner());
    } catch (error) {
      console.error(error);
    }
  }

  const onChangeFile = async (e:any) => {
    try {
      if (!e.currentTarget.files) return;

      const formData = new FormData();

      console.log(formData);

      formData.append("file", e.currentTarget.files[0]);

      console.log(formData);

      const t = await formData.getAll("file");

      console.log(t);
      
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!signer) return;

    setContract(new Contract("0x2574DA41879DE59D726Edd41B7811E17870F6785", mintNftAbi, signer))
  }, [signer]);

  useEffect(() => console.log(contract),[contract])


  return (
    <Flex bgColor="red.100" minH="100vh" justifyContent="center" alignItems="center">
      {signer ? (
        <>
          <Text>{signer.address}</Text>
          <Input type="file" onChange={onChangeFile}/>  
        </>
        
      ) : (
        <Button onClick={onClickMetamask}>🦊 로그인</Button>
      )}
    </Flex>
  )
}

export default App;