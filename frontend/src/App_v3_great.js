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
import modernLoftImage from './mansion.jpg';
import suburbanHouseImage from './mansion2.jpg';
import downtownCondoImage from './mansion3.jpg';

import mansionImage from './happyfamily1.jpeg'; // Replace with actual path to image
import mansionImage2 from './happyfamily2.jpeg'; // Replace with actual path to second image
import houseImage from './happyfamily3.jpeg'; // Replace with actual path to third image

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
    transferFromAddress: '',
    transferToAddress: '',
    transferTokenId: '',
    ownerOfTokenId: '',
    tokenOwnerAddress: '',  
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

// 721
// 20

// not: 20
// not: 721


    // remixfreeblock20.json
    const tokenContractAddress = "0x461d9DE40c1e47bc8B0340AbfB7C9827b4c6A26d";
    const token = new web3.eth.Contract(ContractABI, tokenContractAddress);
    this.setState({ token });

    // erc721
    const buyContractAddress = "0x5f48f30472CFdE4D2971A05D825a8Db0d701Ce77";
    const buyContract = new web3.eth.Contract(BuyContractABI, buyContractAddress);
    this.setState({ buyContract });

    const balance = await token.methods.balanceOf(accounts[0]).call();
    this.setState({ tokenBalance: web3.utils.fromWei(balance, 'ether') });

    // erc1155
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
  
  handleOwnerOfTokenIdChange = (event) => {
    this.setState({ ownerOfTokenId: event.target.value });
  };
  
  handleTransferFromAddressChange = (event) => {
    this.setState({ transferFromAddress: event.target.value });
  };
  
  handleTransferToAddressChange = (event) => {
    this.setState({ transferToAddress: event.target.value });
  };
  
  handleTransferTokenIdChange = (event) => {
    this.setState({ transferTokenId: event.target.value });
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
  // requestFreeTokens = async () => {
  //   const { account, token, requestAmount, web3 } = this.state;
  //   try {
  //     const amountInWei = web3.utils.toWei(requestAmount, 'ether');
  //     const response = await token.methods.getFreeTokens(amountInWei).send({ from: account });
  //     console.log('Transaction response:', response);
    
  //     // Fetch the new balance after the transaction has been confirmed
  //     const updatedBalance = await token.methods.balanceOf(account).call();
  //     this.setState({ balance: web3.utils.fromWei(updatedBalance, 'ether') }); // Use 'balance' here instead of 'tokenBalance'
  //   } catch (error) {
  //     console.error('Error when requesting free tokens:', error);
  //   }
  // };
  getOwnerOfToken = async () => {
    const { ownerOfTokenId, buyContract } = this.state;
    try {
      const tokenId = parseInt(ownerOfTokenId);
      const ownerAddress = await buyContract.methods.ownerOf(tokenId).call();
      this.setState({ tokenOwnerAddress: ownerAddress });
      console.log('Owner of the token:', ownerAddress);
    } catch (error) {
      console.error('Error fetching owner of token:', error);
      this.setState({ tokenOwnerAddress: 'Error fetching owner' });
    }
  };
  
  transferFrom = async () => {
    const { transferFromAddress, transferToAddress, transferTokenId, buyContract, account } = this.state;
    try {
      const tokenId = parseInt(transferTokenId);
      const response = await buyContract.methods.transferFrom(transferFromAddress, transferToAddress, tokenId).send({ from: account });
      console.log('transferFrom transaction response:', response);
    } catch (error) {
      console.error('Error when executing transferFrom:', error);
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
      // ... add more properties as needed
    ];

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


        {/* <Container className="my-5"> */}

        <Container fluid>
      <Row>
        <Col md={3} className="sidebar">
          {/* Sidebar content */}
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="/home">Dashboard</Nav.Link>
            <Nav.Link eventKey="link-1">Properties</Nav.Link>
            <Nav.Link eventKey="link-2">Agents</Nav.Link>
            <Nav.Link eventKey="link-3">Favorites</Nav.Link>
            <Nav.Link eventKey="link-4">Messages</Nav.Link>
            <Nav.Link eventKey="link-5">Settings</Nav.Link>
          </Nav>
        </Col>
        <Col md={9}>
          {/* Main content */}
          <Card className="p-3 bg-white">
            <Card.Body>


            <Carousel>
  <Carousel.Item>
    <img
      className="d-block w-100 smaller-image"
      src={mansionImage}
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>On this decentralized platform: The future of your dream house</h3>
      <p>description for item 1</p>
      <Button variant="primary">more info</Button>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 smaller-image"
      src={mansionImage2}
      alt="Second slide"
    />
    <Carousel.Caption>
      <h3>On this decentralized platform: Enjoy the moment in life</h3>
      <p>description for item 2</p>
      <Button variant="primary">more info</Button>
    </Carousel.Caption>
  </Carousel.Item>
  <Carousel.Item>
    <img
      className="d-block w-100 smaller-image"
      src={houseImage}
      alt="Third slide"
    />
    <Carousel.Caption>
      <h3>On this decentralized platform: Take control of your living area</h3>
      <p>description for item 3</p>
      <Button variant="primary">more info</Button>
    </Carousel.Caption>
  </Carousel.Item>
</Carousel>

        {/* <Container className="my-5">
      <Card className="p-3 bg-white">
        <Card.Body> */}
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

          {/* 请求免费代币 */}
          <Card className="text-center mb-4">
            <Card.Body>
              {/* <h4>Token Balance: {tokenBalance/1000000000000000000} FB20</h4> */}
              <Card.Title>ERC20 Token Balance: {tokenBalance/1000000000000000000} FB20</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Enter token amount" value={requestAmount} onChange={e => this.setState({ requestAmount: e.target.value })} />
                  <Button variant="primary" onClick={this.requestFreeTokens}>Request Tokens</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          {/* 奖励索取 */}
          {/* <Card className="text-center mb-4">
            <Card.Body>
            <Card.Title>Click the button to do the batch transfer, and you will get 2 different types of special coin (erc1155) as coupon and ticket.</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Button variant="success" onClick={this.claimRewards}>Claim Rewards</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card> */}
          <Card className="text-center mb-4">
            <Card.Body>
              <Card.Title>Click the button to do the batch transfer, and you will get 2 different types of special coin (erc1155) as coupon and ticket.</Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control 
                    type="text" 
                    value={this.state.claimRewardAddress} 
                    onChange={e => this.setState({ claimRewardAddress: e.target.value })} 
                    placeholder="Address to claim rewards to" 
                  />
                  <Button variant="success" onClick={this.claimRewards}>Claim Rewards (Batch Transfer coupons and tickets)</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>


          {/* 批量余额检查 */}
          {/* <Card className="text-center mb-4">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Comma-separated token IDs for batch balance" value={balanceTokenIds} onChange={e => this.setState({ balanceTokenIds: e.target.value })} />
                  <Button variant="info" onClick={this.getBatchBalance}>Check Batch Balances</Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card> */}
     
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
      
        {/* TransferFrom Token UI */}
        <Card className="text-center mb-4">
          <Card.Header>Transfer ERC721 Token</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>From Address</Form.Label>
                <Form.Control type="text" placeholder="Enter from address" value={this.state.transferFromAddress} onChange={this.handleTransferFromAddressChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>To Address</Form.Label>
                <Form.Control type="text" placeholder="Enter to address" value={this.state.transferToAddress} onChange={this.handleTransferToAddressChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Token ID</Form.Label>
                <Form.Control type="text" placeholder="Enter token ID" value={this.state.transferTokenId} onChange={this.handleTransferTokenIdChange} />
              </Form.Group>

              <Button variant="primary" onClick={this.transferFrom}>Transfer Token</Button>
            </Form>
          </Card.Body>
        </Card>


        {/* ownerOf Token UI */}
        <Card className="text-center mb-4">
          <Card.Header>Find Owner of ERC721 Token</Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Token ID</Form.Label>
                <Form.Control type="text" placeholder="Enter token ID" value={this.state.ownerOfTokenId} onChange={this.handleOwnerOfTokenIdChange} />
              </Form.Group>

              <Button variant="primary" onClick={this.getOwnerOfToken}>Find Owner</Button>
              {this.state.tokenOwnerAddress && <p>Owner Address: {this.state.tokenOwnerAddress}</p>}
            </Form>
          </Card.Body>
        </Card>

        <Container>
        <Row>
          <h2>Featured Properties</h2>
          {featuredProperties.map((property) => (
            <Col md={4} key={property.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={property.imageUrl} alt={property.name} style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>{property.name}</Card.Title>
                  <Card.Text>
                    Price: ${property.price}
                  </Card.Text>
                  <Card.Text>
                    {property.reviews} Reviews
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>



      </Col>
      </Row>
    </Container>    
  </>
);

  }
}

export default App;

