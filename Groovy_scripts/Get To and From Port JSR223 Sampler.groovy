<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <JSR223Sampler guiclass="TestBeanGUI" testclass="JSR223Sampler" testname="Get To and From Port JSR223 Sampler">
      <stringProp name="cacheKey">true</stringProp>
      <stringProp name="filename"></stringProp>
      <stringProp name="parameters"></stringProp>
      <stringProp name="script">// ---- READ THE CSV ONCE &amp; SHARE IT ----
import java.nio.file.*
import java.nio.charset.Charset             // &lt;- charset fix

// ➊ Pick the right charset.  Use UTF‑8 if you re‑save the file,
//    otherwise stick with CP‑1252 (a.k.a. Windows‑1252, ANSI)
def csvCharset = Charset.forName(&apos;windows-1252&apos;)   // or: StandardCharsets.UTF_8

def path  = Paths.get(&apos;C:/apache-jmeter-5.6.3/bin/Giridhar Templates/Csv Files/reservePage.csv&apos;)
def lines = Files.readAllLines(path, csvCharset)

// drop header → [fromPort,toPort]
def pairs = lines.tail().collect { line -&gt;
    line.split(&apos;,&apos;, 2).collect { it.trim() }       // trim each column
}

// store as a normal property (object is fine)
props.put(&apos;routes&apos;, pairs)

log.info(&quot;Loaded ${pairs.size()} routes from CSV&quot;)
</stringProp>
      <stringProp name="scriptLanguage">groovy</stringProp>
    </JSR223Sampler>
    <hashTree/>
  </hashTree>
</jmeterTestPlan>
