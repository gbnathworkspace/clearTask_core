import React, { useState} from 'react';

const Habitica: React.FC = () => {

    //variables
    const [habiticaUserId, setHabiticaUserId] = useState('');
    const [habiticaApiKey, setHabiticaApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const handleConnect = async (e: React.FormEvent) => {
        e.preventDefault();
        // Perform the connection logic here

    }

    


    //return element
    return (
        <div className="habitica-settings">
            <h2>Habitica Integration</h2>
            <p className="habitica-description">
                Connect your Habitica account to sync tasks and earn rewards for completing tasks.
            </p>
        
                <div className="connection-form">
                    <form onSubmit={handleConnect}>
                        <div className="form-group">
                            <label htmlFor="habiticaUserId">Habitica User ID</label>
                            <input
                                id="habiticaUserId"
                                type="text"
                                value={habiticaUserId}
                                onChange={(e) => setHabiticaUserId(e.target.value)}
                                placeholder="Enter your Habitica User ID"
                                required
                            />
                            <small>You can find this in your Habitica settings under API</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="habiticaApiKey">Habitica API Key</label>
                            <input
                                id="habiticaApiKey"
                                type="password"
                                value={habiticaApiKey}
                                onChange={(e) => setHabiticaApiKey(e.target.value)}
                                placeholder="Enter your Habitica API Key"
                                required
                            />
                            <small>You can find this in your Habitica settings under API</small>
                        </div>

                        <button 
                            type="submit" 
                            className="connect-button"
                            disabled={isLoading}
                        >
                            Connect to Habitica
                        </button>
                    </form>
                </div>

        </div>
    );
};

export default Habitica;