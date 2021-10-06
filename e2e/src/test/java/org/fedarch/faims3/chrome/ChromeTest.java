/*
 * Copyright 2021 Macquarie University
 *
 * Licensed under the Apache License Version 2.0 (the, "License");
 * you may not use, this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied.
 * See, the License, for the specific language governing permissions and
 * limitations under the License.
 *
 * Filename: ChromeTest.java
 * Description:
 *   TODO
 */
package org.fedarch.faims3.chrome;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.fedarch.faims3.AstroSky;
import org.fedarch.faims3.E2ETest;
import org.fedarch.faims3.TestUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class ChromeTest implements E2ETest {
	// Test URL generated by Github Actions nightly build
	public static final String FAIMS_TEST_URL = "https://selenium.3.faims.edu.au/";

	public RemoteWebDriver driver;

	private boolean isLocal;
	// Longitude as generated by GPS button
	protected String longitude;
	// Latitude as generated by GPS button
	protected String latitude;

	// Newly created record uui
	protected String recordUuid;

	public ChromeTest() {
		setDatabase();
	}

	/**
	 * Setup the ChromeDriver based on parameter.
	 * @param localTest If true, then we'll set up a local connection. Otherwise we'll set up a browserstack one.
	 * @param testDesc Test description for browserstack
	 * @throws MalformedURLException
	 * @throws JSONException
	 */
	public void setup(boolean localTest, String testDesc) throws MalformedURLException, JSONException {
		if (localTest) {
			localConnectionSetup();
			isLocal = true;
		} else {
		    browserstackSetup(testDesc);
		    isLocal = false;
		}
	}

	/**
	 * Localhost setup for Rini's machine.
	 * @throws MalformedURLException
	 * @throws JSONException
	 */
	public void localConnectionSetup() throws MalformedURLException, JSONException {
		ChromeOptions caps = new ChromeOptions();
		caps.setCapability("os", "Windows");
		caps.setCapability("os_version", "10");
		caps.setCapability("browser", "Chrome");
		caps.setCapability("browser_version", "latest");
		// Please download appropriate chrome driver and point to its location
		System.setProperty("webdriver.chrome.driver", "C:\\chromedriver.exe");

		// Allow location
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("profile.default_content_settings.geolocation", 1);
		jsonObject.put("profile.managed_default_content_settings.geolocation", 1);

		caps.setExperimentalOption("prefs", jsonObject);
	    driver = new ChromeDriver(caps);

        //String appURL = "http://localhost:3333/";
	    String appURL = FAIMS_TEST_URL;

	    driver.get(appURL);

	    clearBrowserData();
	}

	/**
	 * Clear browser cache
	 */
	private void clearBrowserData() {
	    driver.manage().deleteAllCookies();

	    //TODO: is this enough? Please check.
	    JavascriptExecutor js = driver;
		js.executeScript("window.localStorage.clear();");
		js.executeScript("window.sessionStorage.clear();");
	}

	/**
	 * Browserstack setup for the test
	 * @param caps Common capabilities
	 * @param testDesc Tests description
	 * @throws MalformedURLException
	 */
	public void browserstackSetup(String testDesc) throws MalformedURLException {
		DesiredCapabilities caps = new DesiredCapabilities();
		caps.setCapability("os", "Windows");
		caps.setCapability("os_version", "10");
		caps.setCapability("browser", "Chrome");
		caps.setCapability("browser_version", "latest");
		caps.setCapability("project", "FAIMS3 - Chrome Windows Tests");
	    caps.setCapability("build", "Alpha");
	    caps.setCapability("name", testDesc.concat(" : ").concat(TestUtils.getCommitMessage()));

	    turnOnBrowserstackLogs(caps);

	    // INIT CHROME OPTIONS
	    ChromeOptions options = new ChromeOptions();
	    Map < String, Object > prefs = new HashMap < String, Object > ();
	    Map < String, Object > profile = new HashMap < String, Object > ();
	    Map < String, Object > contentSettings = new HashMap < String, Object > ();
	    // SET CHROME OPTIONS
	    // 0 - Default, 1 - Allow, 2 - Block
	    contentSettings.put("geolocation", 1);
	    profile.put("managed_default_content_settings", contentSettings);
	    prefs.put("profile", profile);
	    options.setExperimentalOption("prefs", prefs);

	    // SET CAPABILITY
	    caps.setCapability(ChromeOptions.CAPABILITY, options);
	    String userName = System.getenv("BROWSERSTACK_USERNAME");
        String accessKey = System.getenv("BROWSERSTACK_ACCESS_KEY");

	    String URL = "https://" + userName + ":" + accessKey + "@hub-cloud.browserstack.com/wd/hub";

	    driver = new RemoteWebDriver(new URL(URL), caps);

	    driver.get(FAIMS_TEST_URL);

	}

	/**
	 * Optional logging options for browserstack
	 * @param caps
	 * @return
	 */
	public static void turnOnBrowserstackLogs(DesiredCapabilities caps) {
	    // Log settings to debug
	    caps.setCapability("browserstack.console", "verbose");
	    HashMap networkLogsOptions = new HashMap<>();
	    networkLogsOptions.put("captureContent", Boolean.TRUE);
	    // turn on network logs
	    caps.setCapability("browserstack.networkLogs", "true");
	    caps.setCapability("browserstack.networkLogsOptions", networkLogsOptions);
	}

	/**
	 * True if this is connected to Browserstack.
	 * @return
	 */
	@Override
	public boolean isUsingBrowserstack() {
		return !isLocal;
	}

	/**
	 * Fill out all fields in test AsTRoSkY form with valid values.
	 */
	@Override
	public void fillOutFormWithValidFields() {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		// Test GPS point
		WebElement gpsPoint = wait.until(
		        ExpectedConditions.presenceOfElementLocated(By.xpath("//button/span[text()='Take Point']")));
		gpsPoint.click();
		// Make sure the point text has been updated
		wait.until(
		        ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[text()='No point taken.']")));
		// now check that the point was captured
		validateLatLong();

		// Click on Action button
	    // The value will be updated in JSON
		WebElement action = driver.findElement(By.xpath("//*[text()='Action!']"));
		action.click();

	    // Email field
	    WebElement emailField = driver.findElement(By.id("email-field"));
	    emailField.sendKeys(AstroSky.EMAIL_CHROME);

	    TestUtils.scrollDown(driver);

	    // Colour field
	    WebElement strField = driver.findElement(By.id("str-field"));
	    // clear old value
	    strField.sendKeys(Keys.chord(Keys.CONTROL,"a", Keys.DELETE));
	    strField.sendKeys(AstroSky.COLOUR);

	    // Text area - test unicode
	    WebElement textField = driver.findElement(By.id("multi-str-field"));
	    textField.sendKeys(Keys.chord(Keys.CONTROL,"a", Keys.DELETE));
	    textField.sendKeys(AstroSky.UNICODE);

	    TestUtils.scrollDown(driver);

	    WebElement intField = driver.findElement(By.id("int-field"));
	    intField.sendKeys(Keys.chord(Keys.CONTROL,"a", Keys.DELETE));
	    intField.sendKeys(AstroSky.INTEGER);

	    // Multiple currency field
	    WebElement multiCurrField = wait.until(
	            ExpectedConditions.elementToBeClickable(
	            		By.id("multi-select-field")));
	    multiCurrField.click();
	    // choose first, second: $, Euro
	    List<WebElement> currencies = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(
	    		By.xpath("//*[@id='menu-multi-select-field']/div[3]/ul/li")));
	    currencies.get(0).click();
	    currencies.get(1).click();

	    // click out of the dropdown
	    driver.findElementByXPath("//body").click();

	    // tick the checkbox
	    driver.findElement(By.id("checkbox-field")).click();

	    // radio button
	    List<WebElement> radioButtons = wait.until(ExpectedConditions.visibilityOfNestedElementsLocatedBy(
	    		By.id("radio-group-field"),
	    		By.tagName("label")));
	    // click the fourth one
	    radioButtons.get(3).click();
	}



	/**
	 * Validate the lat long values generated by "Take Point" button.
	 */
	@Override
	public void validateLatLong() {
		String text = driver.findElement(By.xpath(
				"//button/span[text()='Take Point']/../following-sibling::span")).getText();
		this.latitude = getLatitude();
		this.longitude = getLongitude();

		String expectedText = new StringBuffer("Lat: ").append(latitude)
				.append("; Long: ").append(longitude).toString();
		assertEquals(expectedText, text);
	}


	/**
	 * Load up new Example B observation form.
	 *
	 */
	@Override
	public void loadNewAstroSkyForm() {
		loadProjects();

		// Find the '+' button for new observation
		WebElement newObservation = new WebDriverWait(driver, 10)
				.until(ExpectedConditions.elementToBeClickable(By.xpath("//a[@href='/projects/default_test_proj/new-observation']")));

		newObservation.click();
	}

	public void tearDown() {
		// The driver.quit statement is required, otherwise the test continues to
		// execute, leading to a timeout.
		driver.quit();
	}

	@Override
	public String getLatitude() {
		if (this.latitude == null) {
		    Object lat = driver.executeScript(
				 "function getPosition() {\n" +
				 "    return new Promise((res, rej) => {\n" +
				 "    	navigator.geolocation.getCurrentPosition(res, rej)\n" +
				 "    });\n" +
				 "}\n" +
				 "\n" +
				 "async function getLat() {\n" +
				 "    var position = await getPosition();\n" +
				 "    return position.coords.latitude;\n" +
				 "}\n" +
				 "return getLat();");
		    assertNotNull(lat);
		    this.latitude = lat.toString();
		}
		return this.latitude;
	}

	@Override
	public String getLongitude() {
		if (this.longitude == null) {
		    Object longi = driver.executeScript(
				 "function getPosition() {\n" +
				 "    return new Promise((res, rej) => {\n" +
				 "    	navigator.geolocation.getCurrentPosition(res, rej)\n" +
				 "    });\n" +
				 "}\n" +
				 "\n" +
				 "async function getLong() {\n" +
				 "    var position = await getPosition();\n" +
				 "    return position.coords.longitude;\n" +
				 "}\n" +
				 "return getLong();");
		    assertNotNull(longi);
		    this.longitude = longi.toString();
		}
		return longitude;
	}

	/**
	 * Validate JSON at the end of the form with input values.
	 * @throws JSONException
	 */
	@Override
	public void validateJSON() throws JSONException, AssertionError {
		// Find JSON
		WebDriverWait wait = new WebDriverWait(driver, 10);

		WebElement json = wait.until(ExpectedConditions.visibilityOf(
				driver.findElement(By.xpath("//*[@id=\"root\"]/div[3]/div[3]/div/form/div/div[3]/div[2]/pre"))));
		JSONObject jsonObject = new JSONObject(json.getText());
		JSONObject values = jsonObject.getJSONObject("values");
		// Take note of uuid so we can retrieve it later
		this.recordUuid = values.getString("_id");

		JSONObject gps = values.getJSONObject("take-point-field");
		assertEquals(this.latitude, gps.get("latitude").toString());
	    assertEquals(this.longitude, gps.get("longitude").toString());
		assertEquals("Change!", values.get("action-field").toString());
		assertEquals(AstroSky.EMAIL_CHROME, values.get("email-field").toString());
        assertEquals(AstroSky.COLOUR, values.get("str-field").toString());
        assertEquals(AstroSky.UNICODE, values.get("multi-str-field").toString());
        assertEquals(AstroSky.INTEGER, values.get("int-field").toString());
        assertEquals("[\"USD\",\"EUR\"]", values.get("multi-select-field").toString());
        assertEquals("true", values.get("checkbox-field").toString());
        assertEquals("4", values.get("radio-group-field").toString());
        // no errors
        assertEquals("{}", jsonObject.get("errors").toString());
	}

	@Override
	public void verifyMessage(String message) {
		WebDriverWait wait = new WebDriverWait(driver, 10);
		wait.until(ExpectedConditions.presenceOfElementLocated(
				By.xpath("//div[@class='MuiAlert-message' and text()='" + message + "']")));
	}

	@Override
	public void loadProjects() {
		//TODO: remove when FAIMS3-297 is fixed
		// temporary workaround for the bug
		try {
			Thread.sleep(12000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// Click on "Projects"
		WebElement projects = new WebDriverWait(driver, 10)
				.until(ExpectedConditions.elementToBeClickable(By.xpath("//a[@href='/projects']")));
		projects.click();

		// workaround for FAIMS3-263
		try {
			Thread.sleep(3000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void loadObservationForm(String uuid) {
		WebDriverWait wait = new WebDriverWait(driver, 20);

		wait.until(ExpectedConditions.visibilityOfElementLocated(
				By.xpath("//a[@href='/projects/default_test_proj/observations/" + uuid + "']")))
		           .click();
	}
}
