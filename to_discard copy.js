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

