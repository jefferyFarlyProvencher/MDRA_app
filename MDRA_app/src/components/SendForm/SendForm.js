import prepareToSend from '../PrepareToSend/PrepareToSend';

let SendForm = async() => {
    console.log("----FETCHING THINGY-----\n");
    try{
        let response = await fetch('132.204.93.102/MDAH_api/MDAH_HANDLER', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: prepareToSend()
        });
        let responseJson = await response.json();
        console.log("RESULT:"+JSON.stringify(responseJson));
        if(responseJson)
            console.log("----FETCHING OVER-----\n");
            return [Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100]
    }
    catch(err){
        console.log(err);
    }
};

export default SendForm;

