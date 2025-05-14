<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <JSR223Sampler guiclass="TestBeanGUI" testclass="JSR223Sampler" testname="Get Confirmation Page Data JSR223 Sampler">
      <stringProp name="scriptLanguage">groovy</stringProp>
      <stringProp name="parameters"></stringProp>
      <stringProp name="filename"></stringProp>
      <stringProp name="cacheKey">true</stringProp>
      <stringProp name="script">// --------- confirmationPage.csv loader -------------
import java.nio.file.*
import java.nio.charset.Charset

def csvCharset = Charset.forName(&apos;windows-1252&apos;) // or UTF-8
def path = Paths.get(&apos;C:/apache-jmeter-5.6.3/bin/Giridhar Templates/Csv Files/confirmationPage.csv&apos;)
def lines = Files.readAllLines(path, csvCharset)

def headers = lines[0].split(&apos;,&apos;).collect { it.trim() }
def rows = lines.tail().collect { line -&gt;
    def cols = line.split(&apos;,&apos;, headers.size()).collect { it.trim() }
    def map = [:]
    headers.eachWithIndex { h, i -&gt;
        // Prevent scientific notation for creditCardNumber
        def val = cols[i]
        if (h == &apos;creditCardNumber&apos; &amp;&amp; val =~ /[eE]\+/) {
            val = new java.text.DecimalFormat(&apos;#&apos;).format(Double.parseDouble(val))
        }
        map[h] = val
    }
    map
}

props.put(&apos;confirmData&apos;, rows)
log.info(&quot;Loaded ${rows.size()} confirmation rows from CSV&quot;)
</stringProp>
    </JSR223Sampler>
    <hashTree/>
  </hashTree>
</jmeterTestPlan>
