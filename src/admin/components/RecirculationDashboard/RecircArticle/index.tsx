import get from "lodash/get";
import set from "lodash/set";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import IconButton from "@mui/material/IconButton";
import Field from "@/admin/components/Field";
import { type Article } from "@/db/recirculationArticles";

export default function RecircArticle(props: {
  article: Partial<Article>;
  onChange: (section: Article) => void;
  removeArticle: () => void;
}) {
  const {
    article,
    onChange,
    removeArticle,
  } = props;

  const onArticleChange = (path: string[], value: unknown) => {
    const newArticle = {
      dbId: get(article, "dbId"),
      page: get(article, "page", "default"),
      headline: get(article, "headline", ""),
      url: get(article, "url", ""),
      image: get(article, "image", ""),
      imageAlt: get(article, "imageAlt", ""),
    };
    set(newArticle, path[0], value);
    onChange(newArticle);
  };

  const autofill = async () => {
    const url = get(article, "url");
    if (!url) return;
    const rsp = await fetch(`/api/admin/autofill-recirc-article?url=${url}`);
    const data = await rsp.json();
    onChange({
      dbId: get(article, "dbId"),
      page: get(article, "page", "default"),
      headline: data.headline,
      url,
      image: data.image,
      imageAlt: data.imageAlt,
    });
  };

  return (
    <Paper
      sx={{ p: 4 }}
      elevation={1}
    >
      <Stack spacing={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Field
            field={{
              type: "string",
              title: "URL",
              path: "url",
            }}
            value={get(article, "url", "")}
            onChange={onArticleChange}
          />
          <Box>
            <IconButton
              size="small"
              aria-label="Autofill"
              onClick={autofill}
              disabled={!get(article, "url")}
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Box>
        </Stack>
        <Field
          field={{
            type: "string",
            title: "Headline",
            path: "headline",
          }}
          value={get(article, "headline", "")}
          onChange={onArticleChange}
        />
        <Field
          field={{
            type: "string",
            title: "Image URL",
            path: "image",
          }}
          value={get(article, "image", "")}
          onChange={onArticleChange}
        />
        <Field
          field={{
            type: "string",
            title: "Image Alt Text",
            path: "imageAlt",
          }}
          value={get(article, "imageAlt", "")}
          onChange={onArticleChange}
        />
        <div>
          <Button
            variant="outlined"
            startIcon={<DeleteIcon />}
            onClick={removeArticle}
          >
            Remove article
          </Button>
        </div>
      </Stack>
    </Paper>
  );
}
