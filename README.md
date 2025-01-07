# README: Chrome Extension for Topic Transition Analysis

## Overview
This project is a Chrome Extension designed to help users track and understand their topic transitions during ongoing browsing or research sessions. By analyzing the browser's search history, the extension identifies when the user has shifted their focus from one topic to another. The ultimate goal is to integrate Web Neural Networks (WebNN) to detect these topic changes and provide insightful descriptions of the transitions.

---
Note:- all the user data processing takes place on device, therefore no user data ever leaves the device mitigating all the data security concerns.
---

## Features
1. **Search History Analysis**:
   - Tracks user search queries and visited websites during a browsing session.
   - Groups similar queries and pages into "topics" based on context and keywords.

2. **Topic Transition Detection**:
   - Identifies when the user transitions from one topic to another during research.
   - Uses heuristic algorithms initially, with plans to integrate WebNN for advanced analysis.

3. **Insightful Descriptions**:
   - Summarizes the nature of each topic and provides a brief description when a transition is detected.
   - Offers insights into browsing patterns and research dynamics.

---

## Installation
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/aditya06121/history-graph-extension.git
   ```
2. Navigate to `chrome://extensions/` in your Chrome browser.
3. Enable "Developer Mode" using the toggle in the top-right corner.
4. Click "Load unpacked" and select the project folder.
5. The extension will appear in your browser's toolbar.

---

## Usage
1. Start a research session by enabling the extension via the toolbar.
2. Browse as usual. The extension will monitor search queries and visited sites in real-time.
3. When a topic change is detected:
   - A notification will appear summarizing the transition.
4. Click on the extension icon to view detailed descriptions and logs of your browsing topics.

---

## How It Works
1. **Search History Analysis**:
   - The extension collects search queries and URLs, groups them based on similarity, and assigns them to a "topic cluster."
   
2. **Topic Transition Detection**:
   - The initial implementation uses keyword overlap and time-based heuristics to detect transitions.
   - Future updates will use WebNN to:
     - Analyze semantic meaning of queries and visited pages.
     - Provide more accurate and dynamic topic detection.

3. **Description Generation**:
   - After detecting a transition, the extension uses natural language processing (NLP) to summarize the content of the previous topic and give a brief overview of the new one.

---

## Future Plans
- **Integration with WebNN**:
  - Leverage Web Neural Networks for advanced semantic analysis of user activity.
  - Improve accuracy and efficiency in detecting topic shifts.
  
- **Enhanced Insights**:
  - Provide a detailed overview of research behavior, including the frequency of transitions and time spent on each topic.
  
- **Customizable Settings**:
  - Allow users to configure thresholds for topic changes.
  - Add options to ignore specific domains or keywords.

---

## Contribution
Community contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of the changes.

---

## License
This project is licensed under the GNU License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments
This project is inspired by the need to streamline research processes and enhance productivity by providing meaningful insights into how we navigate information online.
