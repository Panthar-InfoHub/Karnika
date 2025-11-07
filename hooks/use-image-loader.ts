"use client";

import { useState, useEffect, useCallback } from "react";

// Client-side cache for signed URLs
const clientUrlCache = new Map<string, { url: string; expires: number }>();

interface UseImageLoaderOptions {
  fallback?: string;
}

/**
 * Hook to load signed URLs on the client side with caching
 * Prevents unnecessary re-fetches and improves performance
 */
export function useImageLoader(imagePath: string | undefined, options: UseImageLoaderOptions = {}) {
  const { fallback = "/placeholder.svg" } = options;
  const [imageUrl, setImageUrl] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePath) {
      setImageUrl(fallback);
      setIsLoading(false);
      return;
    }

    // If it's already a valid URL, use it directly
    if (imagePath.startsWith("http") || imagePath.startsWith("/")) {
      setImageUrl(imagePath);
      setIsLoading(false);
      return;
    }

    // Check cache first
    const now = Date.now();
    const cached = clientUrlCache.get(imagePath);
    if (cached && cached.expires > now) {
      setImageUrl(cached.url);
      setIsLoading(false);
      return;
    }

    // Fetch signed URL from server
    setIsLoading(true);
    setError(null);

    fetch("/api/images/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: imagePath }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          // Cache for 6 days (URLs are valid for 7 days)
          clientUrlCache.set(imagePath, {
            url: data.url,
            expires: now + 6 * 24 * 60 * 60 * 1000,
          });
          setImageUrl(data.url);
        } else {
          setImageUrl(fallback);
        }
      })
      .catch((err) => {
        console.error("Failed to load image:", err);
        setError(err.message);
        setImageUrl(fallback);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [imagePath, fallback]);

  return { imageUrl, isLoading, error };
}

/**
 * Hook to load multiple signed URLs efficiently
 * Batches requests and caches results
 */
export function useImageLoaderBatch(imagePaths: string[], options: UseImageLoaderOptions = {}) {
  const { fallback = "/placeholder.svg" } = options;
  const [imageUrls, setImageUrls] = useState<string[]>(imagePaths.map(() => fallback));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imagePaths || imagePaths.length === 0) {
      setImageUrls([]);
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    const results: string[] = [];
    const pathsToFetch: string[] = [];
    const pathsToFetchIndices: number[] = [];

    // Check cache and identify which images need fetching
    imagePaths.forEach((path, index) => {
      if (!path || path.startsWith("http") || path.startsWith("/")) {
        results[index] = path || fallback;
      } else {
        const cached = clientUrlCache.get(path);
        if (cached && cached.expires > now) {
          results[index] = cached.url;
        } else {
          pathsToFetch.push(path);
          pathsToFetchIndices.push(index);
        }
      }
    });

    // If all URLs are cached or public, return immediately
    if (pathsToFetch.length === 0) {
      setImageUrls(results);
      setIsLoading(false);
      return;
    }

    // Fetch missing URLs
    setIsLoading(true);
    setError(null);

    fetch("/api/images/signed-urls-batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths: pathsToFetch }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.urls && Array.isArray(data.urls)) {
          data.urls.forEach((url: string, idx: number) => {
            const originalPath = pathsToFetch[idx];
            const resultIndex = pathsToFetchIndices[idx];

            // Cache the URL for 6 days (URLs are valid for 7 days)
            clientUrlCache.set(originalPath, {
              url: url,
              expires: now + 6 * 24 * 60 * 60 * 1000,
            });

            results[resultIndex] = url;
          });
        }
        setImageUrls(results);
      })
      .catch((err) => {
        console.error("Failed to load images:", err);
        setError(err.message);
        // Fill remaining with fallback
        pathsToFetchIndices.forEach((index) => {
          results[index] = fallback;
        });
        setImageUrls(results);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [JSON.stringify(imagePaths), fallback]);

  return { imageUrls, isLoading, error };
}
