import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { Contract, ethers } from "ethers";
import { JsonRpcSigner } from "ethers";
import { ChangeEvent, FC, useEffect, useState } from "react";
import mintNftAbi from "./mintNftAbi.json";
import axios from "axios";

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

  const uploadImage = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: import.meta.env.VITE_PINATA_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET,
          },
        }
      );
      console.log(import.meta.env.VITE_PINATA_KEY);
      console.log(import.meta.env.VITE_PINATA_SECRET);
      return `https://violet-actual-wolf-678.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error(error);
    }
  };
 
  const uploadMetadata = async (image: string) => {
    try {
      const metadata = JSON.stringify({
        pinataContent: {
          name: "Test",
          description: "Test",
          image,
        },
        pinataMetadata: {
          name: "test.json",
        },
      });

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: import.meta.env.VITE_PINATA_KEY,
            pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET,
          },
        }
      );

      return `https://violet-actual-wolf-678.mypinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error(error);
    }
  };

  //여기서response.data.IpfsHash 에서 IpfsHash값은 pinata에 사진 클릭해서 들어가면 사진의 url주소 있는데 그게 IpfsHash임
  //https://violet-actual-wolf-678.mypinata.cloud/ipfs/QmbePcPE7LjGn32LGQAYzBbe5dWCb67nLS7w4p2pBAfhVw 여기서 Qmbe로 시작하는 저부분이 IpfsHash
  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    try {

      if (!e.currentTarget.files || !contract) return;

      const formData = new FormData();

      formData.append("file", e.currentTarget.files[0]);

      const imageUrl = await uploadImage(formData);

      const metadataUrl = await uploadMetadata(imageUrl!);
      
      const tx = await contract.mintNft(metadataUrl);

      await tx.wait();
      console.log(imageUrl);
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
          <input id="file2" type="file" onChange={onChangeFile} style={{ display: "none"}}/>
          <label htmlFor="file2">민팅</label>
            
        </>
        
      ) : (
        <Button onClick={onClickMetamask}>🦊 로그인</Button>
      )}
    </Flex>
  )
}

export default App;

