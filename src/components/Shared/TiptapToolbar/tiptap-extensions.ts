import Image from "@tiptap/extension-image";

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      dataId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.dataId) {
            return {};
          }
          return {
            "data-id": attributes.dataId,
          };
        },
      },
    };
  },
});
