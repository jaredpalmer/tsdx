import { Box, Text } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";

const Release = (props) => {
  const { url, name, date, body } = props;

  return (
    <Box>
      <Text fontWeight="bold" fontSize="3xl">
        #{" "}
        <a href={url} target="_blank" rel="noopener">
          {name}
        </a>
      </Text>
      <Text>
        Published on{" "}
        <Text as="span" color="blue.500">{`${new Date(
          date
        ).toDateString()}.`}</Text>
      </Text>
      <Markdown>{body}</Markdown>
    </Box>
  );
};

const ReleasesRenderer = ({ releases }) => {
  return releases.map((release) => (
    <Release
      date={release.published_at}
      name={release.tag_name}
      body={release.body}
      url={release.html_url}
    />
  ));
};

export default ReleasesRenderer;
