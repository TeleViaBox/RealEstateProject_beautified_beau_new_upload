import React, { Component } from 'react';
import Web3 from 'web3';
import ContractABI from './remixfreeblock20.json';
import BuyContractABI from './remixbuy721.json';
import ERC1155ABI from './remixbuy1155.json';
// import { Container, Button, Form, Card, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { Navbar, Nav, NavDropdown, Container, Card, Form, Button } from 'react-bootstrap';
import { Container, Row, Col, Navbar, Nav, NavDropdown, Card, Form, Button } from 'react-bootstrap';
import { Carousel } from 'react-bootstrap';

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

    const tokenContractAddress = "0x461d9DE40c1e47bc8B0340AbfB7C9827b4c6A26d";
    const token = new web3.eth.Contract(ContractABI, tokenContractAddress);
    this.setState({ token });

    const buyContractAddress = "0x5f48f30472CFdE4D2971A05D825a8Db0d701Ce77";
    const buyContract = new web3.eth.Contract(BuyContractABI, buyContractAddress);
    this.setState({ buyContract });

    const balance = await token.methods.balanceOf(accounts[0]).call();
    this.setState({ tokenBalance: web3.utils.fromWei(balance, 'ether') });

    const erc1155ContractAddress = "0x007AbFAdc91B989CcA22A2BDe9f400e9C94B3c7D";
    const erc1155Contract = new web3.eth.Contract(ERC1155ABI, erc1155ContractAddress);
    this.setState({ erc1155Contract });
  };

  claimRewards = async () => {
    console.log('Attempting to claim rewards...');
    const { erc1155Contract, claimRewardAddress, account } = this.state;
    if (!erc1155Contract) {
      console.error("ERC-1155 contract is not initialized");
      return;
    }
    try {
      const response = await erc1155Contract.methods.claimRewards(claimRewardAddress).send({ from: account });
      console.log('Claim rewards transaction response:', response);
    } catch (error) {
      console.error('Error when claiming rewards:', error);
    }
  };
  
  claimBatchRewards = async () => {
    const { account, erc1155Contract, claimTokenIds } = this.state;
    if (!erc1155Contract) {
      console.error("ERC-1155 contract is not initialized");
      return;
    }
    const tokenIds = claimTokenIds.split(',').map(id => parseInt(id));
    try {
      const response = await erc1155Contract.methods.claimBatchRewards(tokenIds).send({ from: account });
      console.log('Claim batch rewards transaction response:', response);
    } catch (error) {
      console.error('Error when claiming batch rewards:', error);
    }
  };

  getBatchBalance = async () => {
    console.log('Attempting to get batch balances...');
    const { erc1155Contract, balanceOfAddresses, balanceTokenIds } = this.state;
    if (!erc1155Contract) {
      console.error("ERC-1155 contract is not initialized");
      return;
    }
    const addresses = balanceOfAddresses.split(',').map(a => a.trim());
    const tokenIds = balanceTokenIds.split(',').map(id => parseInt(id));
    console.log('Addresses:', addresses);
    console.log('Token IDs:', tokenIds);
    try {
      const balance = await erc1155Contract.methods.balanceOfBatch(addresses, tokenIds).call();
      console.log('Batch balance:', balance);
    } catch (error) {
      console.error('Error when getting batch balances:', error);
    }
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

  requestFreeTokens = async () => {
    const { account, token, requestAmount } = this.state;
    try {
      const amountInWei = Web3.utils.toWei(requestAmount, 'ether');
      const response = await token.methods.getFreeTokens(amountInWei).send({ from: account });
      console.log('Transaction response:', response);
      const balance = await token.methods.balanceOf(account).call();
      this.setState({ balance: Web3.utils.fromWei(balance, 'ether') });
    } catch (error) {
      console.error('Error when requesting free tokens:', error);
    }
  }

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


    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container fluid>
            <Navbar.Brand href="#home">Realestate E-commerce Platform by UB CSE</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home page</Nav.Link>
                <Nav.Link href="#link">Product page</Nav.Link>
                <NavDropdown title="Categories" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Category 1</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Category 2</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Category 3</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Others</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className="mt-3">
          <Row>
            <Col md={3} className="sidebar">
              {/* Sidebar content */}
              {/* ... */}
            </Col>
            <Col md={9}>
              {/* Main content */}
              {/* ... */}
            </Col>
          </Row>
        </Container>

        {/* Carousel Component */}
        <Container fluid>
          <Row>
            <Col>
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100" src="house1.jpg" alt="First slide" />
                  <Carousel.Caption>
                    <h3>房屋拍賣標題 1</h3>
                    <p>這是關於第一個房屋拍賣的描述。</p>
                    <Button variant="primary">了解更多</Button>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src="house2.jpg" alt="Second slide" />
                  <Carousel.Caption>
                    <h3>房屋拍賣標題 2</h3>
                    <p>這是關於第二個房屋拍賣的描述。</p>
                    <Button variant="primary">了解更多</Button>
                  </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src="house3.jpg" alt="Third slide" />
                  <Carousel.Caption>
                    <h3>房屋拍賣標題 3</h3>
                    <p>這是關於第三個房屋拍賣的描述。</p>
                    <Button variant="primary">了解更多</Button>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default App;

