export async function getAllAssets(): Promise<any> {
    const options = {
      method: 'GET',
      headers: {'Accept': 'application/json', 'content-type': 'application/json'}
    };
  
  
    try {
      const response = await fetch('https://cors-anywhere.herokuapp.com/https://api-demo.lyra.finance/public/get_all_currencies', options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }




  export async function getInstruments(currency: string): Promise<any> {
    const options = {
      method: 'GET',
      headers: {'Accept': 'application/json', 'content-type': 'application/json'}
    };

    const queryString = new URLSearchParams({
      currency: currency,
      expired: 'false',
      instrument_type: 'option',
    }).toString();
  
  
    try {
      const fullUrl = 'https://cors-anywhere.herokuapp.com/https://api-demo.lyra.finance/public/get_instruments' + '?' + queryString;
      const response = await fetch(fullUrl, options);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(error);
      throw error; 
    }
  }
  