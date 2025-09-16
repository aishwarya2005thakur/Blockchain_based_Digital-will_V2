import React, { useState, useEffect } from 'react';
import { Wallet, Shield, Clock, User, DollarSign, FileText, CheckCircle, AlertCircle, Calendar, ArrowRight, Eye, EyeOff } from 'lucide-react';

const DigitalWillApp = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [walletConnected, setWalletConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  // Form states for creating will
  const [willForm, setWillForm] = useState({
    beneficiaryAddress: '',
    inheritanceAmount: '',
    unlockDate: '',
    unlockTime: '12:00'
  });
  
  // Form states for claiming inheritance
  const [claimForm, setClaimForm] = useState({
    testatorAddress: ''
  });
  
  // Mock data for existing wills (in real app, this would come from blockchain)
  const [userWills, setUserWills] = useState([
    {
      id: '1',
      beneficiary: '0x742d...8f91',
      amount: 100,
      unlockDate: '2024-12-31',
      status: 'active',
      created: '2024-01-15'
    }
  ]);

  const [claimableWills, setClaimableWills] = useState([
    {
      testatorAddress: '0x123a...4b56',
      amount: 250,
      unlockDate: '2024-10-01',
      status: 'ready',
      testatorName: 'Anonymous'
    }
  ]);

  const connectWallet = async () => {
    // Mock wallet connection - replace with actual Aptos wallet integration
    setWalletConnected(true);
    setUserAddress('0x1234567890abcdef1234567890abcdef12345678');
  };

  const handleCreateWill = async () => {
    
    // Validation
    if (!willForm.beneficiaryAddress || !willForm.inheritanceAmount || !willForm.unlockDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Convert date and time to timestamp
    const unlockDateTime = new Date(`${willForm.unlockDate}T${willForm.unlockTime}`);
    const unlockTimestamp = Math.floor(unlockDateTime.getTime() / 1000);
    
    try {
      // Here you would call your smart contract's create_will function
      console.log('Creating will with params:', {
        beneficiary: willForm.beneficiaryAddress,
        amount: willForm.inheritanceAmount,
        unlockTime: unlockTimestamp
      });
      
      // Mock success - in real app, wait for transaction confirmation
      const newWill = {
        id: Date.now().toString(),
        beneficiary: willForm.beneficiaryAddress,
        amount: parseFloat(willForm.inheritanceAmount),
        unlockDate: willForm.unlockDate,
        status: 'active',
        created: new Date().toISOString().split('T')[0]
      };
      
      setUserWills([...userWills, newWill]);
      setWillForm({ beneficiaryAddress: '', inheritanceAmount: '', unlockDate: '', unlockTime: '12:00' });
      alert('Digital Will created successfully!');
      
    } catch (error) {
      console.error('Error creating will:', error);
      alert('Failed to create will. Please try again.');
    }
  };

  const handleClaimInheritance = async (testatorAddress) => {
    try {
      // Here you would call your smart contract's claim_inheritance function
      console.log('Claiming inheritance from:', testatorAddress);
      
      // Mock success
      setClaimableWills(claimableWills.filter(will => will.testatorAddress !== testatorAddress));
      alert('Inheritance claimed successfully!');
      
    } catch (error) {
      console.error('Error claiming inheritance:', error);
      alert('Failed to claim inheritance. Please check conditions and try again.');
    }
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isDateInPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Digital Will</h1>
            </div>
            
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Wallet className="h-5 w-5" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{formatAddress(userAddress)}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <User className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!walletConnected ? (
          <div className="text-center py-20">
            <Wallet className="h-20 w-20 text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Connect Your Aptos Wallet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Connect your Aptos wallet to create digital wills and manage your inheritance planning on the blockchain.
            </p>
            <button
              onClick={connectWallet}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-1">
              {[
                { id: 'create', label: 'Create Will', icon: FileText },
                { id: 'manage', label: 'My Wills', icon: Shield },
                { id: 'claim', label: 'Claim Inheritance', icon: DollarSign }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                    activeTab === id
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            {/* Create Will Tab */}
            {activeTab === 'create' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <FileText className="h-7 w-7 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">Create Digital Will</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Beneficiary Address *
                      </label>
                      <input
                        type="text"
                        value={willForm.beneficiaryAddress}
                        onChange={(e) => setWillForm({ ...willForm, beneficiaryAddress: e.target.value })}
                        placeholder="0x1234567890abcdef..."
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Inheritance Amount (APT) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={willForm.inheritanceAmount}
                        onChange={(e) => setWillForm({ ...willForm, inheritanceAmount: e.target.value })}
                        placeholder="100.00"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Unlock Date *
                        </label>
                        <input
                          type="date"
                          value={willForm.unlockDate}
                          onChange={(e) => setWillForm({ ...willForm, unlockDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Unlock Time
                        </label>
                        <input
                          type="time"
                          value={willForm.unlockTime}
                          onChange={(e) => setWillForm({ ...willForm, unlockTime: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-200">
                          <p className="font-medium mb-1">Important Notice:</p>
                          <p>Once created, this will cannot be modified. The inheritance funds will be locked until the unlock date. Make sure all details are correct before proceeding.</p>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleCreateWill}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                    >
                      <FileText className="h-5 w-5" />
                      <span>Create Digital Will</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Wills Tab */}
            {activeTab === 'manage' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">My Digital Wills</h2>
                  <div className="text-sm text-gray-400">
                    Total: {userWills.length} will{userWills.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                {userWills.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Wills Created</h3>
                    <p className="text-gray-400">Create your first digital will to get started.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {userWills.map((will) => (
                      <div key={will.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${will.status === 'active' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                            <span className="text-lg font-semibold text-white">Will #{will.id}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            will.status === 'active' ? 'bg-green-900/30 text-green-300' : 'bg-gray-900/30 text-gray-300'
                          }`}>
                            {will.status.charAt(0).toUpperCase() + will.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-400">Beneficiary</p>
                            <p className="text-white font-medium">{formatAddress(will.beneficiary)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Amount</p>
                            <p className="text-white font-medium">{will.amount} APT</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Unlock Date</p>
                            <p className="text-white font-medium">{will.unlockDate}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Created</p>
                            <p className="text-white font-medium">{will.created}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Claim Inheritance Tab */}
            {activeTab === 'claim' && (
              <div>
                <div className="max-w-2xl mx-auto mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center space-x-3 mb-6">
                      <DollarSign className="h-7 w-7 text-purple-400" />
                      <h2 className="text-2xl font-bold text-white">Claim Inheritance</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Testator Address
                        </label>
                        <input
                          type="text"
                          value={claimForm.testatorAddress}
                          onChange={(e) => setClaimForm({ ...claimForm, testatorAddress: e.target.value })}
                          placeholder="0x1234567890abcdef... (Address of will creator)"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => console.log('Check inheritance for:', claimForm.testatorAddress)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                      >
                        Check Inheritance Status
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Available Inheritances</h3>
                  
                  {claimableWills.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-2xl">
                      <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Inheritances Available</h3>
                      <p className="text-gray-400">You currently have no inheritances ready to claim.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {claimableWills.map((will, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="h-6 w-6 text-green-400" />
                              <span className="text-lg font-semibold text-white">Inheritance Ready</span>
                            </div>
                            <span className="bg-green-900/30 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                              Ready to Claim
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                            <div>
                              <p className="text-gray-400">From</p>
                              <p className="text-white font-medium">{formatAddress(will.testatorAddress)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Amount</p>
                              <p className="text-white font-medium">{will.amount} APT</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Available Since</p>
                              <p className="text-white font-medium">{will.unlockDate}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleClaimInheritance(will.testatorAddress)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                          >
                            <DollarSign className="h-5 w-5" />
                            <span>Claim {will.amount} APT</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DigitalWillApp;