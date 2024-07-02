import express from "express"
const app = express();


const getWidevineLicense = (contentId) => {
    // Generate a unique KeyId and Key
    const keyId = crypto.randomBytes(16).toString('hex');
    const key = crypto.randomBytes(16).toString('base64');
  
    // Normally, you'd retrieve these from a secure storage or key management system
    return {
      keyId: keyId,
      key: key
    };
  };
app.post("/speke",(req,res)=>{
    const { contentId, systemIds } = req.body;

  // Validate request (e.g., check authorization, contentId, etc.)
  if (!contentId || !systemIds) {
    return res.status(400).send('ContentId and SystemIds are required');
  }

  const keys = systemIds.map(systemId => {
    let license;
    if (systemId === 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed') { // Widevine SystemId
      license = getWidevineLicense(contentId);
    }
    return {
      systemId: systemId,
      keyId: license.keyId,
      key: license.key
    };
  });

  res.json({ keys });
})

app.listen(8000,()=>{
    console.log(`Server is Running on PORT:- 8000`)
})