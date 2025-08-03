
import {ConnectButton, useActiveAddress} from '@arweave-wallet-kit/react';
import { RetroHeader } from './components/ardacity/ar-retro-header';


function App() {
  const walletaddy = useActiveAddress();
  console.log("your connected wallet is",walletaddy);
  
  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>
      <RetroHeader
      title="GLIMPSE"
      subtitle="SEARCH ALMOST"
      highlightedWord="ANYTHING"
      bottomText="WITH VECTOR SEARCHING ACCURACY"
      showCharacters={true}
      character1Image="https://pbs.twimg.com/profile_images/1940352680846635008/gMK5JINJ_400x400.jpg"
      character2Image="https://zh5mns2xs4orzalnne62iz47xz7ag54ujodwlfmdbrzk5xymqkeq.arweave.net/yfrGy1eXHRyBbWk9pGefvn4Dd5RLh2WVgwxyrt8Mgok"
      speechBubbleText="Wow look great! What's Glimpse"
      infoBoxText="Glimpse is the one stop solution to search anything on the hyperbeam on the go using vector search feature."
      onSearch={(query, filter) => console.log(query, filter)}
      // onNavToggle={(option) => console.log(option)}
    />
    
     
    
    </div>
  );
}

export default App;
