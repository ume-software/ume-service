import { utilService } from "@/services";

describe("Class UtilService : changeToSlug", () => {
    it("should correctly replace special characters with their corresponding replacements", () => {
        const title = "Đi chơi với bạn bè";
        const prefix = "test-prefix";
        const expectedSlug = "di-choi-voi-ban-be-test-prefix";
        expect(utilService.changeToSlug(title, prefix)).toBe(expectedSlug);
    });

    it("should correctly replace spaces with hyphens", () => {
        const title = "Hello world!";
        const prefix = "test-prefix";
        const expectedSlug = "hello-world-test-prefix";
        expect(utilService.changeToSlug(title, prefix)).toBe(expectedSlug);
    });

    it("should correctly handle multi-dash sequences", () => {
        const title = "Hello--world---!";
        const prefix = "test-prefix";
        const expectedSlug = "hello-world-test-prefix";
        expect(utilService.changeToSlug(title, prefix)).toBe(expectedSlug);
    });

    it("should handle the case where the title only contains special characters", () => {
        const title = "!@#$%^&*()";
        const prefix = "test-prefix";
        const expectedSlug = "test-prefix";
        expect(utilService.changeToSlug(title, prefix)).toBe(expectedSlug);
    });

    it("should handle the case where the title is an empty string", () => {
        const title = "";
        const prefix = "test-prefix";
        const expectedSlug = "test-prefix";
        expect(utilService.changeToSlug(title, prefix)).toBe(expectedSlug);
    });
});

describe("Class UtilService : revokeFileName", () => {
  it("should add timestamp and keep the file extension by default", () => {
      const oldFileName = "example.png";
      const newFileName = utilService.revokeFileName(oldFileName);
      const expectedFileNameRegex = new RegExp(
          `^example-\\d{13}\\.png$`
      );
      expect(newFileName).toMatch(expectedFileNameRegex);
  });

  it("should not add timestamp when addTime is false", () => {
      const oldFileName = "example.jpg";
      const newFileName = utilService.revokeFileName(oldFileName, false);
      const expectedFileNameRegex = new RegExp(
          `^example\\.jpg$`
      );
      expect(newFileName).toMatch(expectedFileNameRegex);
  });

  it("should add timestamp and resize dimensions if resizeOptions are provided", () => {
      const oldFileName = "image.jpeg";
      const resizeOptions = { width: 800, height: 600 };
      const newFileName = utilService.revokeFileName(oldFileName, true, resizeOptions);
      const expectedFileNameRegex = new RegExp(
          `^image-\\d{13}-800x600\\.jpeg$`
      );
      expect(newFileName).toMatch(expectedFileNameRegex);
  });

  it("should only add resize dimensions if no timestamp and resizeOptions are provided", () => {
      const oldFileName = "photo.png";
      const resizeOptions = { width: 1200, height: 900 };
      const newFileName = utilService.revokeFileName(oldFileName, false, resizeOptions);
      const expectedFileNameRegex = new RegExp(
          `^photo-1200x900\\.png$`
      );
      expect(newFileName).toMatch(expectedFileNameRegex);
  });

  it("should handle files with multiple dots in the filename", () => {
      const oldFileName = "my.file.example.txt";
      const newFileName = utilService.revokeFileName(oldFileName);
      const expectedFileNameRegex = new RegExp(
          `^my\\.file\\.example-\\d{13}\\.txt$`
      );
      expect(newFileName).toMatch(expectedFileNameRegex);
  });
});
