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
 * Filename: IOSTest.java
 * Description:
 *   TODO
 */

package org.fedarch.faims3.ios;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;

import org.fedarch.faims3.AstroSky;
import org.fedarch.faims3.E2ETest;
import org.fedarch.faims3.TestUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import io.appium.java_client.ios.IOSDriver;
import io.appium.java_client.ios.IOSElement;
import io.appium.java_client.remote.IOSMobileCapabilityType;

public class IOSTest implements E2ETest {
	protected IOSDriver<IOSElement> driver;

	private boolean isLocal;

	// Save latitude generated by GPS button for the JSON check later
	protected String latitude;

	// Save long generated by GPS button for the JSON check later
	protected String longitude;

	// Newly created observation form's id
	protected String recordUuid;

	public IOSTest() {
		setDatabase();
	}

	/**
	 * Setup the IOSDriver based on parameter.
	 * @param localTest If true, then we'll set up a local connection. Otherwise we'll set up a browserstack one.
	 * @param testDesc Test description for browserstack
	 * @throws MalformedURLException
	 */
	public void setup(boolean localTest, String testDesc) throws MalformedURLException {
		DesiredCapabilities caps = new DesiredCapabilities();
		// allow location services
	    caps.setCapability(IOSMobileCapabilityType.LOCATION_SERVICES_ENABLED, "true");
	    caps.setCapability(IOSMobileCapabilityType.LOCATION_SERVICES_AUTHORIZED, "true");
	    // allow everything else so we don't get permission popups
	    caps.setCapability(IOSMobileCapabilityType.AUTO_ACCEPT_ALERTS, "true");
	    caps.setCapability("automationName", "XCUITest");
		if (localTest) {
			localConnectionSetup(caps);
			isLocal = true;
		} else {
		    browserstackSetup(caps, testDesc);
		    isLocal = false;
		}
	}

	/**
	 * Localhost setup for Rini's machine.
	 * @throws MalformedURLException
	 */
	public void localConnectionSetup(DesiredCapabilities caps) throws MalformedURLException {
	    caps.setCapability("platformName", "iOS");
	    caps.setCapability("platformVersion", "11.0");
	    caps.setCapability("deviceName", "iPhone 12");
	    caps.setCapability("adbExecTimeout", "1200000");
	    caps.setCapability("app", "C:\\github\\FAIMS3\\ios\\App\\App\\build\\FAIMS3.ipa");

	    driver = new IOSDriver<IOSElement>(new URL("http://127.0.0.1:4723/wd/hub"), caps);
	}

	/**
	 * Browserstack setup for the test
	 * @param testDescription Test scenario. Link to JIRA if possible.
	 * @throws MalformedURLException
	 */
	public void browserstackSetup(DesiredCapabilities caps, String testDescription) throws MalformedURLException {
	    caps.setCapability("project", "FAIMS3 - iOS Tests");
	    caps.setCapability("build", "Alpha");
	    caps.setCapability("name", testDescription.concat(" : ").concat(TestUtils.getCommitMessage()));

	    // Specify device and os_version for testing
	    caps.setCapability("device", "iPhone 12");
        caps.setCapability("os_version", "12");
	    // Latest Appium browserstack version with correct geolocation
	    caps.setCapability("browserstack.appium_version", "1.21.0");

	    turnOnBrowserstackLogs(caps);

	    caps.setCapability("app", System.getenv("app_url"));
	    caps.setCapability("browserstack.user", System.getenv("BROWSERSTACK_USERNAME"));
	    caps.setCapability("browserstack.key", System.getenv("BROWSERSTACK_ACCESS_KEY"));

	    driver = new IOSDriver<IOSElement>(
                new URL("http://hub-cloud.browserstack.com/wd/hub"), caps);

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
		        ExpectedConditions.presenceOfElementLocated(By.xpath("//button/span[@text='Take Point']")));
		gpsPoint.click();
		// Make sure the point text has been updated
		wait.until(
		        ExpectedConditions.invisibilityOfElementLocated(By.xpath("//*[@text='No point taken.']")));
		// now check that the point was captured
		validateLatLong();

		// Click on Action button
	    // The value will be updated in JSON
		WebElement action = driver.findElement(By.xpath("//*[@text='Action!']"));
		action.click();

	    // Email field
	    WebElement emailField = driver.findElement(By.id("email-field"));
	    emailField.sendKeys(AstroSky.EMAIL_IOS);

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
				By.xpath("//div[@class='MuiAlert-message' and @text='" + message + "']")));
	}

	@Override
	public void loadProjects() {
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
