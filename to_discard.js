import React, { Component } from 'react';
import Web3 from 'web3';
import ContractABI from './remixfreeblock20.json';
import BuyContractABI from './remixbuy721.json';
import ERC1155ABI from './remixbuy1155.json';
// import { Container, Button, Form, Card, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Navbar, Nav, NavDropdown, Container, Card, Form, Button } from 'react-bootstrap';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Card, Form, Button } from 'react-bootstrap';

class App extends Component {
  state = {
    account: '0x0',
    token: null,
    buyContract: null,
    web3: null,
    tokenBalance: '0',
    propertyId: '',
    ownerOfPropertyId: '',
    ownerOf: '',
    requestAmount: '',
    claimTokenIds: '',
    balanceTokenIds: '',
    claimRewardAddress: '',
    balanceOfTokenIds: '',
    balanceOfAddresses: '',
    approveToAddress: '', // New state variable for 'to' address input
    approveTokenId: '', // New state variable for 'tokenId' input
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.loadBlockchainData();
      } catch (error) {
        console.error("User denied account access");
      }
    } else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    // erc721
    const buyContractAddress = "0x5f48f30472CFdE4D2971A05D825a8Db0d701Ce77";
    const buyContract = new web3.eth.Contract(BuyContractABI, buyContractAddress);
    this.setState({ buyContract });

    const balance = await token.methods.balanceOf(accounts[0]).call();
    this.setState({ tokenBalance: web3.utils.fromWei(balance, 'ether') });
  };

  handleClaimRewardAddressChange = (event) => {
    this.setState({ claimRewardAddress: event.target.value });
  };

  handleBalanceOfTokenIdsChange = (event) => {
    this.setState({ balanceOfTokenIds: event.target.value });
  };

  handleBalanceOfAddressesChange = (event) => {
    this.setState({ balanceOfAddresses: event.target.value });
  };

  handleClaimTokenIdsChange = (event) => {
    this.setState({ claimTokenIds: event.target.value });
  };

  handleBalanceTokenIdsChange = (event) => {
    this.setState({ balanceTokenIds: event.target.value });
  };

  handleInputChange = (event) => {
    this.setState({ requestAmount: event.target.value });
  };

  handleApproveToAddressChange = (event) => {
    this.setState({ approveToAddress: event.target.value });
  };

  handleApproveTokenIdChange = (event) => {
    this.setState({ approveTokenId: event.target.value });
  };

  approveTransaction = async () => {
    // Here you would call your smart contract's approve method
    const { approveToAddress, approveTokenId, account, token } = this.state;
    try {
      // Make sure to convert tokenId to a number if necessary
      const tokenId = parseInt(approveTokenId);
      const response = await token.methods.approve(approveToAddress, tokenId).send({ from: account });
      console.log('Approve transaction response:', response);
    } catch (error) {
      console.error('Error when approving transaction:', error);
    }
  };


  addProperty = async () => {
    const { account, buyContract } = this.state;
    if (!buyContract) {
      console.error("ERC-721 contract is not initialized");
      return;
    }
    try {
      const response = await buyContract.methods.addProperty(account).send({ from: account });
      console.log('addProperty transaction response:', response);
    } catch (error) {
      console.error('Error when calling addProperty:', error);
    }
  };

  getOwnerOf = async () => {
    const { buyContract, ownerOfPropertyId } = this.state;
    const response = await buyContract.methods.ownerOf(ownerOfPropertyId).call();
    this.setState({ ownerOf: response });
  };

  render() {
    const { account, tokenBalance, propertyId, ownerOfPropertyId, ownerOf, requestAmount } = this.state;
    const { claimTokenIds, balanceTokenIds } = this.state;
    const { approveToAddress, approveTokenId } = this.state;

    const featuredProperties = [
      { id: 1, name: "Modern Loft", price: "350,000", imageUrl: modernLoftImage, reviews: 12 },
      { id: 2, name: "Suburban House", price: "450,000", imageUrl: suburbanHouseImage, reviews: 8 },
      { id: 3, name: "Downtown Condo", price: "550,000", imageUrl: downtownCondoImage, reviews: 21 },
    ];

    return (
      <>

        <Container fluid>
      <Row>

          <Card className="p-3 bg-white">
            <Card.Body>

          {/* 账户和代币信息 */}
          <Card className="text-center mb-4">
            <Card.Header>Anyone can login here</Card.Header>
            <Card.Body>
              <Card.Title>Account's address: {account}</Card.Title>
              {/* <Card.Title>ERC721 Token Balance: {tokenBalance/1000000000000000000}</Card.Title> */}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Set the price of the house" value={propertyId} onChange={e => this.setState({ propertyId: e.target.value })} />
                  <Button variant="primary" onClick={this.addProperty}>Add Property</Button>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="token ID (for example, 3). token ID must be an integer." value={ownerOfPropertyId} onChange={e => this.setState({ ownerOfPropertyId: e.target.value })} />
                  <Button variant="secondary" onClick={this.getOwnerOf}>Check Owner Of Token</Button>
                </Form.Group>

                {ownerOf && <p>Owner of Token ID {ownerOfPropertyId}: {ownerOf}</p>}
              </Form>
            </Card.Body>
          </Card>


     
    </Card.Body>
          </Card>



        {/* Approve Token UI */}
        <Card className="text-center mb-4">
        <Card.Header>Use the seller's account login here</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Approve to the Address of</Form.Label>
                <Form.Control type="text" placeholder="Enter address" value={approveToAddress} onChange={this.handleApproveToAddressChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Token ID of ERC721</Form.Label>
                <Form.Control type="text" placeholder="Enter ERC721 token ID" value={approveTokenId} onChange={this.handleApproveTokenIdChange} />
              </Form.Group>

              <Button variant="primary" onClick={this.approveTransaction}>Approve (erc721)</Button>
            </Form>
          </Card.Body>
        </Card>

        <Container>

      </Container>



      </Col>
      </Row>
    </Container>    
  </>
);

  }
}

export default App;

