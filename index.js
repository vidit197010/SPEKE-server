import express from "express"
import crypto from "crypto"
import "dotenv/config"
const app = express();
app.use(express.json())

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
  console.log("ContentId",contentId);
  console.log("SystemIds",systemIds);

  const keys = systemIds.map(systemId => {
    let license;
    if (systemId === 'edef8ba9-79d6-4ace-a3c8-27dcd51d21ed') { // Widevine SystemId
      license = getWidevineLicense(contentId);
      console.log("Inside")
    }
    return {
      systemId: systemId,
      keyId: license.keyId,
      key: license.key
    };
  });

  res.json({ keys });
})
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is Running on PORT:- 8000`)
})