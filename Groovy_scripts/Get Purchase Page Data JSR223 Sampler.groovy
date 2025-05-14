<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <JSR223Sampler guiclass="TestBeanGUI" testclass="JSR223Sampler" testname="Get Purchase Page Data JSR223 Sampler">
      <stringProp name="scriptLanguage">groovy</stringProp>
      <stringProp name="parameters"></stringProp>
      <stringProp name="filename"></stringProp>
      <stringProp name="cacheKey">true</stringProp>
      <stringProp name="script">// -------------- load purchasePage.csv once ----------------
import java.nio.file.*
import java.nio.charset.Charset

def csvCharset = Charset.forName(&apos;windows-1252&apos;)          // UTF‑8 if you resave

def purchasePath  = Paths.get(&apos;C:/apache-jmeter-5.6.3/bin/Giridhar Templates/Csv Files/purchasePage.csv&apos;)
def purchaseLines = Files.readAllLines(purchasePath, csvCharset)

/*
 *  CSV layout:  flight ,  price , airline
 *  Skip header -&gt; each row becomes [flight, price, airline]
 */
def purchases = purchaseLines.tail().collect { line -&gt;
    line.split(&apos;,&apos;, 3).collect { it.trim() }
}

// make it available to every thread / iteration
props.put(&apos;purchases&apos;, purchases)

log.info(&quot;Loaded ${purchases.size()} purchase rows from CSV&quot;)
</stringProp>
    </JSR223Sampler>
    <hashTree/>
  </hashTree>
</jmeterTestPlan>
